# 更新日志
`bonfire`严格遵循 Semantic Versioning 2.0.0 语义化版本规范。

版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
- 主版本号：当做了不兼容的 API 修改。
- 次版本号：当做了向下兼容的功能性新增。
- 修订号：当做了向下兼容的问题修正。

#### v1.1.0 - <Badge type="tip" text="2022-06-21" vertical="top" />
- :fire:工作流    
    - 集成 flowable 流程引擎。
    - 集成 bpmnjs 流程编辑器。
    - 实现模型管理、流程实例管理、待办管理、自建业务表单的模板代码，流程实例图的高亮。
- swagger
    - 升级 swagger 到3.0。
    - 添加全局鉴权头设置，现在不用每个 api 分别设置 authorization header。
- 开发者工具箱集成表单编辑器
- 添加多文件上传。
- 调整 pom 文件，添加版本号变量，调整 build 生成的 finalName。
- 添加一个临时移动端开发底座。

#### v1.0.27 - <Badge type="tip" text="2022-03-24" vertical="top" />
首次公开发布 :tada: :tada: :tada: