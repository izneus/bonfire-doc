# 常见问题

## 工程规范
1. Java POJO命名，前端传过来的请求参数统一命名为XxxQuery，后端返回给前端的结果数据统一命名为XxxVO，其余使用XxxDTO。
1. 如有必要，Query里必须进行参数校验。
1. 所有API请求方式，除了特殊情况（如点击链接使用的文件下载可使用GET），其余请求只能使用POST，Content Type统一为application/json。

## 常见问题

### 前端
#### 字典
参考[前端手册-字典的使用](/guide/frontend.html#%E5%AD%97%E5%85%B8%E7%9A%84%E4%BD%BF%E7%94%A8)部分
#### 页面权限校验
类似login一样，未登录的情况下访问某一路由地址，只需添加`src/permission.js`文件内的白名单即可。
```js
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
```



### 后端