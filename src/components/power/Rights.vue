<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- {{rightsList}} -->
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="url"></el-table-column>
        <el-table-column label="等级" prop="type">
          <template v-slot="scope">
            <el-tag v-if="scope.row.type === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.type === 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    data() {
        return {
            rightsList: [],
        }
    },
    methods: {
        async getRightsList() {
            const { data: res } = await this.$http.get('/rights/list')
            if (res.code !== 200) return this.$message.error(res.msg)
            this.rightsList = res.data
        },
    },
    created() {
        this.getRightsList()
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-left: 15px;
    margin-bottom: 15px;
}
</style>