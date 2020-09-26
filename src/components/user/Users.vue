<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="roles" label="角色"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch
              :disabled="scope.row.isAdmin"
              v-model="scope.row.state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.userId)"
              :disabled="scope.row.isAdmin"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="scope.row.isAdmin"
              @click="removeUserById(scope.row.userId)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                :disabled="scope.row.isAdmin"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="addForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="addForm.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" width="50%" :visible.sync="editDialogVisible" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        var checkUserName = async (rule, value, callback) => {
            if (value.length < 3 || value.length > 10) {
                return callback(new Error('用户名长度在3-10个字符之间'))
            }
            const { data: res } = await this.$http.get(
                `/findUserByUserName/${value}`
            )
            if (res.code !== 200) {
                callback(new Error(res.msg))
            }
        }
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
        }

        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            setTimeout(() => {
                // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                // 所以我就在前面加了一个+实现隐式转换

                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('电话号码格式不正确'))
                    }
                }
            }, 100)
        }
        return {
            queryInfo: {
                query: '',
                pageNum: 1,
                pageSize: 5,
            },
            userList: [],
            total: 0,
            addDialogVisible: false,
            editDialogVisible: false,
            addForm: {
                userName: '',
                userPassword: '',
                nickName: '',
                sex: 1,
                address: '',
                email: '',
                phoneNumber: '',
            },
            addFormRules: {
                userName: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        trigger: 'blur',
                        validator: checkUserName,
                    },
                ],
                userPassword: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '密码长度6-15个字符之间',
                        trigger: 'blur',
                    },
                ],
                nickName: [
                    {
                        min: 3,
                        max: 10,
                        message: '昵称长度3-10个字符之间',
                        trigger: 'blur',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '请输入地址',
                        trigger: 'blur',
                    },
                    {
                        min: 10,
                        message: '地址长度10个字符以上',
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur',
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur',
                    },
                ],
                phoneNumber: [
                    {
                        required: true,
                        message: '请输入电话',
                        trigger: 'blur',
                    },
                    {
                        validator: checkPhone,
                        trigger: 'blur',
                    },
                ],
            },
            editForm: {},
            editFormRules: {
                nickName: [
                    {
                        min: 3,
                        max: 10,
                        message: '昵称长度3-10个字符之间',
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur',
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur',
                    },
                ],
                phoneNumber: [
                    {
                        required: true,
                        message: '请输入电话',
                        trigger: 'blur',
                    },
                    {
                        validator: checkPhone,
                        trigger: 'blur',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '请输入地址',
                        trigger: 'blur',
                    },
                    {
                        min: 10,
                        message: '地址长度10个字符以上',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo,
            })
            if (res.code !== 200) return this.$message.error('获取用户列表失败')
            this.userList = res.data.users
            this.total = res.data.total
            console.log(res)
        },
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage
            this.getUserList()
        },
        async userStateChanged(userInfo) {
            const { data: res } = await this.$http.put(
                `/userPutState/${userInfo.userId}/state/${userInfo.state}`
            )
            if (res.code !== 200) {
                return this.$message.error('更新用户信息失败')
                userInfo.state = !userInfo.state
            }
            this.$message.success('更新用户状态成功')
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    '/insertUser',
                    this.addForm
                )
                if (res.code !== 200) {
                    return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`/users/${id}`)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        editUserInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    `/users/${this.editForm.userId}`,
                    {
                        nickName: this.editForm.nickName,
                        email: this.editForm.email,
                        phoneNumber: this.editForm.phoneNumber,
                        address: this.editForm.address,
                    }
                )
                if (res.code !== 200) return this.$message.error(res.msg)
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('跟新用户信息成功')
            })
        },
        async removeUserById(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            // confirm cancel
            if (confirmResult !== 'confirm')
                return this.$message.info('已取消删除')
            const { data: res } = await this.$http.delete(`/users/${id}`)
            if (res.code !== 200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.getUserList()
        },
    },
    created() {
        this.getUserList()
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-left: 15px;
    margin-bottom: 15px;
}
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
    margin-top: 15px;
}
.el-pagination {
    margin-top: 15px;
}
</style>