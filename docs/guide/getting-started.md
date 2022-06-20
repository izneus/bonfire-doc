# 快速上手
本文会帮助你运行 Bonfire。

## 准备工作
- JDK >= 1.8 (建议1.8)
- Mysql >= 5.7 (建议5.7)
- Maven >= 3.0 (IDEA自带)
- Redis
- Nodejs LTS
- Git

## 开发环境
后端使用`IntelliJ IDEA`，推荐安装插件`Lombok`，`Alibaba Java Coding Guidelines`，`Key Promoter X`，
`MybatisCodeHelperPro`，`Statistic`，`Mybatis Log Plugin`。   
前端使用`WebStorm`。   

## 启动后端

1. **拉取项目代码**   
用如下的Git地址直接导入Maven项目
```
https://gitee.com/izneus/bonfire-mysql.git
```

2. **建立数据库**   
找到工程`db`目录下的.sql文件，   
- 执行`bonfire_mysql.sql`建立系统基础表。
- 执行`quartz_mysql_innodb.sql`建立Quartz调度框架需要的表。
- 执行`flowable.mysql.all.create.sql`建立Flowable工作流引擎需要的表。

3. **修改配置文件**   
工程内有`application.yml`、`application-dev-example.yml`、`application-prod-example.yml`3个配置文件。请手动建立`application-dev.yml`、`application-prod.yml`2个配置文件，内容参考`-example`后缀的2个例子文件。修改数据库相关、redis相关的账号信息等。
::: tip 提交yml配置文件
正式开发中，项目组可能共同维护一组配置文件提交到git，所以注意删除 .gitignore 内的2个 yml 文件的忽略行
:::

4. **运行BonfireApplication**

## 启动前端

1. **拉取项目代码**   
用如下的Git地址直接导入项目
```
https://gitee.com/izneus/bonfire-admin-vue.git
```

2. **安装依赖**   
注意npm源替换为国内源（比如淘宝源），否则依赖下载速度比较慢。`npm install`安装依赖。

3. **运行项目**   
使用命令行的话，`npm run dev`启动服务。默认账号admin1，默认密码Admin123。