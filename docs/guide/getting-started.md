# 快速上手
本文会帮助你运行 Bonfire。

## 准备工作
```
JDK >= 1.8 (建议1.8)
Mysql >= 5.7 (建议5.7) 或 Oracle
Maven >= 3.0
Redis
```

## 开发环境
IDE 这里使用`IntelliJ IDEA`。
推荐安装插件，`Lombok`，`Alibaba Java Coding Guidelines`，`Key Promoter X`，`MybatisCodeHelperPro`，`Statistic`,`Mybatis Log Plugin`。

1. 拉取项目代码
用如下的Git地址直接导入项目
```
https://github.com/izneus/bonfire.git
```

2. 建立数据库
找到工程`db`目录下的.sql文件，执行`bonfire_mysql.sql`建立系统基础表，执行`quartz_mysql_innodb.sql`建立Quartz调度框架需要的表。

3. 修改配置文件
修改工程内`application.yml`、`application-dev.yml`、`application-prod.yml`内的数据库相关、redis相关的账号信息等。

4. 运行BonfireApplication。