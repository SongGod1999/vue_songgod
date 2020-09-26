<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header style="height:70px">
      <span>
        <img
          src="https://www.songgod.cn/group1/M00/00/03/rBoksV9k8buAHU-0AAAb4otoXwQ891.JPG"
          width="200px;"
          height="100%;"
          alt
          srcset
        />
      </span>
      <el-dropdown :show-timeout="300">
        <span class="el-dropdown-link">
          <img slot="reference" class="myimg" :src="$store.state.userInfo.avatar" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>-->
          <el-dropdown-item>
            <span type="danger" @click="logOut">
              <span class="el-icon-switch-button"></span> &nbsp;退出登入
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <MenuTree :menuList="this.menuList"></MenuTree>
        </el-menu>
      </el-aside>
      <el-main v-loading="loading">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MenuTree from './MenuTree.vue' // 引进菜单模板
export default {
    name: 'Home',
    data() {
        return {
            loading: true,
            menuList: [],
            isCollapse: false,
            activePath: this.$store.state.activePath,
        }
    },
    components: {
        MenuTree,
    },
    methods: {
        async logOut() {
            var res = await this.$confirm(
                '此操作将退出系统, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出登入',
                })
            })
            if (res === 'confirm') {
                window.sessionStorage.clear()
                this.$router.push('/login')
            }
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('/Thetreenode')
            if (res.code !== 200) return this.$message.get(res.msg)
            this.menuList = res.data.menus
            console.log(res)
        },
        toggleCollpapse() {
            this.isCollapse = !this.isCollapse
        },
    },
    created() {
        if (window.sessionStorage.getItem('activePath') !== null) {
            this.activePath = window.sessionStorage.getItem('activePath')
        }
        this.getMenuList()
        setTimeout(() => {
            this.loading = false
        }, 500)
    },
}
</script>

<style lang="less" scoped>
.myimg {
    widows: 60px;
    height: 60px;
    border-radius: 50%;
}
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 15px;
    > div {
        display: flex;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
