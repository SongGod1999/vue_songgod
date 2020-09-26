<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" stripe>
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row
                            :class="[
                                'bdbottom',
                                i1 === 0 ? 'bdtop' : '',
                                'vcenter',
                            ]"
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                        >
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="
                                        removeRightById(scope.row, item1.id)
                                    "
                                    >{{ item1.name }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row
                                    :class="[
                                        i2 === 0 ? '' : 'bdtop',
                                        'vcenter',
                                    ]"
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                            >{{ item2.name }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            type="warning"
                                            closable
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                            v-for="(item3,
                                            i3) in item2.children"
                                            :key="item3.id"
                                            >{{ item3.name }}</el-tag
                                        >
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                ></el-table-column>
                <el-table-column
                    label="角色描述"
                    prop="remark"
                ></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            >删除</el-button
                        >
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showSetRightDialog(scope.row)"
                            >分配角色</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="30%"
            @close="setRightDialogClosed"
        >
            <el-tree
                :data="rightsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defkeys"
                ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            roleList: [],
            setRightDialogVisible: false,
            rightsList: [],
            treeProps: {
                label: 'name',
                children: 'children',
            },
            defkeys: [],
            roleId: '',
        }
    },
    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('/roles')
            if (res.code !== 200) return this.$message.error('获取角色列表失败')
            this.roleList = res.data
        },
        async removeRightById(role, rightId) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该权限, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            if (confirmResult !== 'confirm')
                return this.$message.info('取消删除')
            //  this.$message.success(role.id+','+right.id)
            const { data: res } = await this.$http.delete(
                `/roles/${role.id}/rights/${rightId}`
            )
            if (res.code != 200) return this.$message.error(res.msg)
            role.children = res.data.children
        },
        async showSetRightDialog(role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('/rights/tree')
            if (res.code !== 200) return this.$message.error(res.msg)
            this.rightsList = res.data
            //递归
            this.getLeafKeys(role, this.defkeys)
            this.setRightDialogVisible = true
        },
        // 递归获取权限id
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach((item) => this.getLeafKeys(item, arr))
        },
        setRightDialogClosed() {
            this.defkeys = []
        },
        // 分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: idStr}
            )
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success('分配权限成功')
            this.getRoleList()
            this.setRightDialogVisible = false
        },
    },
    created() {
        this.getRoleList()
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-left: 15px;
    margin-bottom: 15px;
}
.el-table {
    margin-top: 15px;
}
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>