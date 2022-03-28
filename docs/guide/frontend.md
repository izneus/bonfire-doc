# 前端手册

::: tip
前端项目基于[vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/)，基础部分文档可以先参阅该项目。
:::

默认样式和查询表格相关代码可优先参阅`src/views/system/use.vue`，该页面基本罗列了常见的样板代码和注释。

## 字典的使用
字典主要使用在一些下拉框等固定选项类别的场景中，.vue文件中通过字典类型（dict_type）引入字典
``` javascript
export default {
    // 字典选项
    dicts: ['user_status']
}
```
最常见的下拉框和表格场景代码如下：
``` javascript
<el-form-item label="用户状态" prop="status">
    <el-select
        v-model="user.status"
        clearable
        placeholder="选择用户状态"
        style="width: 100%"
    >
        <el-option
            v-for="item in dict.user_status"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
        />
    </el-select>
</el-form-item>
```

``` javascript
<el-table-column prop="status" label="状态" show-overflow-tooltip>
  <template slot-scope="scope">
    <el-tag v-if="scope.row.status === '0'" size="small">
      {{ dict.label.user_status[scope.row.status] }}
    </el-tag>
    <el-tag v-else size="small" type="danger">{{ dict.label.user_status[scope.row.status] }}<el-tag>
  </template>
</el-table-column>
```