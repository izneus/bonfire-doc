# 后端手册

## 认证和鉴权

系统采用的是`Spring Security + JWT`形式。通过`Redis`扩展实现黑名单、后台踢用户下线(KickOff)等功能，具体的权限字符串也保存在`Redis`里。受保护的资源，都需要在请求头中携带token。请求Header中添加 `Authorization`项，`Bearer`的token类型。
```
# 注意Bearer和JWT之间有一个空格
Authorization: Bearer xxxx.yyyy.zzzz
```

系统采用RBAC权限系统，都是多对多的关系。API的访问权限控制，只需要在`Controller`对应方法上使用`@PreAuthorize`注解。
``` java{2}
    // listUsers()就需要请求者有sys:users:list项权限
    @PreAuthorize("hasAuthority('sys:users:list')")
    public BasePageVO<ListUserVO> listUsers(@Validated ListUserQuery query) {...}
```

## 缓存
项目采用 Redis + @Cacheable 实现缓存。开启缓存的部分要注意命中率和数据一致性问题。
```
@CacheConfig：一些共用的缓存配置。

@Cacheable：注解的方法的返回值将被加入缓存。在查询时，会先从缓存中获取，若不存在才再发起对数据库的访问

@CachePut：每次都更新缓存。

@CacheEvict：删除缓存。
```
具体使用可以参考`com.izneus.bonfire.module.system.service.impl.SysDictServiceImpl`，缓存了全部字典信息。`cacheNames`和`key`拼接组合后就是 Redis 存储缓存的 key。
``` java{2,6,12}
@Service
@CacheConfig(cacheNames = "dict")
public class SysDictServiceImpl extends ServiceImpl<SysDictMapper, SysDictEntity> implements SysDictService {

    @Override
    @CacheEvict(key = "'all'")
    public void deleteDictById(String dictId) {
        removeById(dictId);
    }

    @Override
    @Cacheable(key = "'all'")
    public List<CacheDictVO> cacheDicts() {
        // 这里很简单的缓存了所有字典，增删改字典的时候直接删除了缓存
        List<SysDictEntity> dicts = list();
        return dicts.stream().map(dict -> BeanUtil.copyProperties(dict, CacheDictVO.class))
                .collect(Collectors.toList());
    }
}
```

## 全局异常处理
异常处理是任何一个程序必备的功能，无论是开发时期的调试，还是部署之后的错误定位。否则对于api调用者和用户来说，简直要怀疑后台在折磨队友。

全局异常处理使用`@ControllerAdvice`。如果你使用`@RestController`,那么使用`@RestControllerAdvice`。

代码在`com.izneus.bonfire.common.exception`下。主要组成为：

1. 统一返回实体类
``` java
package com.izneus.bonfire.common.exception;
import com.izneus.bonfire.common.constant.ErrorCode;
import lombok.Data;
/**
 * 统一异常处理返回信息
 *
 * @author Izneus
 * @date 2020/06/30
 */
@Data
public class ApiError {
    private int code;
    private String message;
    private String status;
    private String exception;
    // 可以按需添加自定义内容丰富错误返回，帮助debug
    // private List<ErrorDetail> details;
    public ApiError(ErrorCode errorCode, String message, String exception) {
        this.message = message;
        this.code = errorCode.getValue();
        this.status = errorCode.getReason();
        this.exception = exception;
    }
}
```
2. 自定义错误代码
``` java
package com.izneus.bonfire.common.constant;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
/**
 * 错误码枚举，
 * 当前采用Http_Status_Code后面扩展2位的方法标记不同错误，
 * 而不同业务系统各自有着自己的详细的错误信息，
 * 可以写在ApiError返回的message字段或者扩展details字段作为user_tip方便api调用者和终端用户查看
 * 当前枚举的错误类型只粗略的分了大类，方便api调用出错时界定负责人，
 * 比如400大多数为请求参数有误，而500是服务器异常
 *
 * @author Izneus
 * @date 2020/06/30
 */
@RequiredArgsConstructor
@Getter
public enum ErrorCode {
    /**
     * 无错误，返回成功
     * HTTP Mapping: 200 OK
     */
    OK(20000, "请求成功"),
    // 省略部分内容请查看源代码
    /**
     * 由于 OAuth 令牌丢失、无效或过期，请求未通过身份验证
     * HTTP Mapping: 401 Unauthorized
     */
    UNAUTHENTICATED(40116, "未认证");
    private final int value;
    private final String reason;
}
```
3. 自定义异常
``` java
package com.izneus.bonfire.common.exception;

import com.izneus.bonfire.common.constant.ErrorCode;
import lombok.Getter;

/**
 * 通用异常
 *
 * @author Izneus
 * @date 2020/07/02
 */
@Getter
public class BadRequestException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String errorMessage;

    public BadRequestException(ErrorCode errorCode, String errorMessage) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
    // 省略部分内容请查看源代码
}
```
4. 全局异常处理
``` java
package com.izneus.bonfire.common.exception;

// import ...
/**
 * 全局出错处理
 *
 * @author Izneus
 * @date 2020/06/29
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    /**
     * 处理自定义的错误请求类异常
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequestException(BadRequestException e) {
        log.error("BadRequestException", e);
        // 提取错误码的前三位作为HttpStatusCode
        String value = String.valueOf(e.getErrorCode().getValue());
        String httpStatusCode = value.substring(0, 3);
        // 构造返回
        return new ResponseEntity<>(
                new ApiError(e.getErrorCode(), e.getErrorMessage(), e.toString()),
                HttpStatus.valueOf(Integer.parseInt(httpStatusCode))
        );
    }
    // 省略部分内容请查看源代码
}
```

开发中，在需要的地方直接抛错即可
``` java
throw new BadRequestException(ErrorCode.PERMISSION_DENIED, "账号异常已被锁定，请联系系统管理员");
```

## 访问日志
自定义注解实现记录api调用日志，记录会保存在数据库sys_access_log表中，开发中在`controller`的方法上加`@AccessLog`即可，如下所示：
``` java{1}
@AccessLog("用户登录")
@ApiOperation("用户登录")
@PostMapping("/login")
public LoginVO login(@Validated @RequestBody LoginQuery loginQuery) {
    return loginService.login(loginQuery);
}
```
可在yml配置文件中`accessLog: true`全局开关日志功能。注解详细代码请参考`com.izneus.bonfire.common.aspect.AccessLogAspect`

## 任务调度
`SpringBoot`下最简单的定时任务就是`@Scheduled`注解。实际使用中，随着任务量的增加、调度参数的频繁更改，马上会造成调度任务混乱不堪。如果需要实现动态管理任务，并且提供友好的web页面，那么可以采用`Quartz`。具体代码可参见`com.izneus.bonfire.module.quartz`。增加新调度任务可按照如下流程：
1. 后台添加任务逻辑处理类。可参考
``` java
public class SysTask {

    /**
     * 测试调度任务用的方法
     *
     * @param params 执行参数，这里采用的全部参数采用一条字符串传入，半角逗号分割，
     *               方法体内自己分割之后转换类型之后使用
     */
    public void test(String params) {
        log.info("SysTask.test执行，参数：{}", params);
    }

}
```
2. 前端新建定时任务信息。
3. 执行任务调度。 

## 代码生成
使用 Mybatis Plus 的 CodeGenerator 生成 Controller、Service、Entity、Mapper 等，直接执行`com.izneus.bonfire.common.util.CodeGenerator`的 main 方法输入表名即可，注意需要先设置好数据库连接、package等变量。

## 服务监控
系统提供主机名、地址、cpu、系统、内存、jvm、jre等信息。

## 多数据源
一个应用需要访问多个数据库的场景下，使用`@DS`注解切换数据源。
1. `application.yml`中配置数据源。
``` yml
spring:
  # 多数据源
  datasource:
    dynamic:
      primary: bonfire
      strict: false
      datasource:
        bonfire:
          driver-class-name: oracle.jdbc.OracleDriver
          url: jdbc:oracle:thin:@127.0.0.1:1521:orcl
          username: 账号
          password: 密码
        lamp:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://127.0.0.1:3306/lamp?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=UTF-8
          username: 账号
          password: 密码
```
2. 类或者方法上`@DS`切换数据源，不加注解默认会使用yml中primary定义的主库。
``` java{2}
@Service
@DS("lamp")
public class DsCityServiceImpl extends ServiceImpl<DsCityMapper, DsCityEntity> implements DsCityService {

}
```
数据源分组等其他详细配置请参考[官方文档](https://dynamic-datasource.com/)

## 请求参数校验
对外暴露的api接口必然需要做参数校验，提高程序健壮性，否则应用部署上线，客户会让你看看什么叫残忍。这里我们使用`@Validated`校验参数。
1. 在Controller的接收参数前加`@Validated`
``` java{4}
@AccessLog("用户登录")
@ApiOperation("用户登录")
@PostMapping("/login")
public LoginVO login(@Validated @RequestBody LoginQuery loginQuery) {
    return loginService.login(loginQuery);
}
```
2. 在POJO里添加注解定义校验规则
``` java{5,9,13,17}
@ApiModel("登录表单")
@Data
public class LoginQuery {
    @ApiModelProperty(value = "用户名", required = true)
    @Pattern(regexp = RegExp.USERNAME, message = "用户名必须为6-20位字母或者数字")
    private String username;

    @ApiModelProperty(value = "密码", required = true)
    @Pattern(regexp = RegExp.PASSWORD, message = "密码必须包含小写字母、大写字母和数字，长度为8～16")
    private String password;

    @ApiModelProperty(value = "验证码", required = true)
    @NotBlank(message = "验证码不能为空")
    private String captcha;

    @ApiModelProperty(value = "验证码id", required = true)
    @NotBlank(message = "验证码id不能为空")
    private String captchaId;
}
```
3. 常用注解，详情请参阅[官方文档](https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#section-builtin-constraints)

|注解|说明|
|---|---|
|@Null|	检查该字段为空|
|@NotNull|	不能为null|
|@NotBlank|	不能为空，会忽视空格|
|@NotEmpty|	不能为空|
|@Max(value=)|	值只能小于或等于该值|
|@Min(value=)|	值只能大于或等于该值|
|@Past|	检查该字段的日期是在过去|
|@Future|	检查该字段的日期是否是属于将来的日期|
|@Email|	检查是否是一个有效的email地址|
|@Pattern(regex=, flags=)|	必须符合指定的正则表达式|
|@Range(min=,max=,message=)|必须在合适的范围内|
|@Size(min=, max=)|	检查该字段的size是否在min和max之间，可以是字符串、数组、集合、Map等|
|@Length(min=,max=)|	长度是否在min和max之间,只能用于字符串|
|@AssertTrue|Boolean或boolean，该字段只能为true|
|@AssertFalse|Boolean或boolean，该字段只能为false|

## API文档
已集成 Swagger 生成api文档，主要注解在 Controller 和 接收参数的 POJO 上。启动项目后访问`http://localhost:8080/swagger-ui.html`查看文档。
1. Controller 里，`@Api`和`@ApiOperation`，注意`@RequestMapping`里用/v1区分api版本。
``` java{1,4,10}
@Api(tags = "系统:登录")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class LoginController {

    private final LoginService loginService;

    @AccessLog("用户登录")
    @ApiOperation("用户登录")
    @PostMapping("/login")
    public LoginVO login(@Validated @RequestBody LoginQuery loginQuery) {
        return loginService.login(loginQuery);
    }

}
```
2. POJO 里，`@ApiModel`和`@ApiModelProperty`。
``` java{1,4,8,12,16}
@ApiModel("登录表单")
@Data
public class LoginQuery {
    @ApiModelProperty(value = "用户名", required = true)
    @Pattern(regexp = RegExp.USERNAME, message = "用户名必须为6-20位字母或者数字")
    private String username;

    @ApiModelProperty(value = "密码", required = true)
    @Pattern(regexp = RegExp.PASSWORD, message = "密码必须包含小写字母、大写字母和数字，长度为8～16")
    private String password;

    @ApiModelProperty(value = "验证码", required = true)
    @NotBlank(message = "验证码不能为空")
    private String captcha;

    @ApiModelProperty(value = "验证码id", required = true)
    @NotBlank(message = "验证码id不能为空")
    private String captchaId;
}
```

## 文件上传下载
文件上传较简单，可以参考`SysFileController`的`uploadFile`方法，核心就是
``` java
multipartFile.transferTo(file);
```
重点说下文件下载。下载文件分2步：
1. 生成临时token
2. 用临时token下载文件

后台提供`GET`方式下载文件，具体代码实现可参考`SysFileController`的`downloadFile`方法。

## 导入导出
导入导出文件的传输，参考文件上传下载。以用户导入为例子，实现参考`SysUserController`下的`importUsers()`，流程为先上传Excel，信息保存在文件表中，解析表头把信息写入数据库。导出用户`exportUsers()`方向相反，读取用户表信息创建临时Excel文件，返回临时token。

## 工作流引擎
todo