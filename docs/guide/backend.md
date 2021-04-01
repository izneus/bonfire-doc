# 后端手册

## 前期准备
idea插件，lombok，alibaba java coding guidelines，key promoter x，mybatiscodehelperpro，statistic，maven

## 权限控制

## 缓存

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

## 日志

## 任务调度

## 代码生成

## 服务监控

## 多数据源

## 参数校验

## 文档生成