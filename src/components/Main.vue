<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>用户信息</span>
              <el-button style="float: right;" size="mini" plain loading type="primary">用户中心</el-button>
              <el-button
                @click="getCode"
                type="primary"
                plain
                style="float: right;margin-right: 10px;"
                size="mini"
              >获取源码</el-button>
            </div>
            <el-avatar
              shape="square"
              :size="110"
              :src="$store.state.userInfo.avatar"
              style="float:left"
              :key="1"
            ></el-avatar>
            <div class="table" style="float:right;width:400px;">
              <el-table :data="tableInfo" border height="120">
                <el-table-column prop="userName" label="用户账号" />
                <el-table-column prop="nickName" label="用户昵称" />
                <el-table-column prop="department" label="所属部门" />
                <el-table-column fixed="right" prop="roles" label="用户角色" />
              </el-table>
            </div>
          </el-card>
          <el-card class="box-card">
            <div v-for="x in 3" :key="x" class="text item"></div>
          </el-card>
        </div>
      </el-col>
      <!-- 右边部分 -->
      <el-col :span="13">
        <div class="grid-content bg-purple">
          <el-card>
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in 6"
                :key="item"
                :style="{background:'url('+imagList[item-1]+')',backgroundSize: '100% 100%',border: '1px '}"
              ></el-carousel-item>
            </el-carousel>
            <aplayer
              style="margin-top:20px;margin-bottom:30px;"
              autoplay
              repeat="repeat-all"
              :music="{
                  title: 'MELANCHOLY',
                  artist: 'White Cherry',
                  src: 'http://music.163.com/song/media/outer/url?id=1297742167.mp3',
                  pic: 'http://p2.music.126.net/-CFt0bZ07CkM8Chc6sM8Og==/109951164922344481.jpg?param=177y177',
              }"
              :list="musicList"
            ></aplayer>
            {{$store.state.userinfo}}
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import aplayer from 'vue-aplayer'
export default {
    name: 'Main',
    components: {
        // 别忘了引入组件
        aplayer: aplayer,
    },
    data() {
        return {
            musicList: [],
            tableInfo: [],
            userInfo: {},
            imagList: [
                'http://www.songgod.cn/group1/M00/00/03/rBoksV9jleGAHl8wAADnnMOZ0C8681.JPG',
                'https://www.songgod.cn/group1/M00/00/03/rBoksV9jleGARuOAAAD2lraxDHQ55.JPEG',
                'https://www.songgod.cn/group1/M00/00/03/rBoksV9jleKAPvPJAAJ0xa5y9A018.JPEG',
                'https://www.songgod.cn/group1/M00/00/03/rBoksV9jleCAA3LZAADRN3ThIlU66.JPEG',
                'https://www.songgod.cn/group1/M00/00/03/rBoksV9jleCAaQgzAAEcSiCEBv455.JPEG',
                'https://www.songgod.cn/group1/M00/00/03/rBoksV9jld-AbWFkAACjEztmWIY92.JPEG',
            ],
            tableInfo: [],
        }
    },
    methods: {
        loadMusicList() {
            this.musicList = [
                {
                    artist: '羽肿',
                    lrc: '',
                    title: 'Windy Hill',
                    src:
                        'http://music.163.com/song/media/outer/url?id=427606780.mp3',
                    pic:
                        'http://p2.music.126.net/dAJR6IWlKitcNVlfQwtgfA==/18241997416865263.jpg?param=130y130',
                },
                {
                    artist: '宗次郎',
                    lrc: '',
                    title: 'いつも何度でも',
                    src:
                        'http://music.163.com/song/media/outer/url?id=480353.mp3',
                    pic:
                        'http://p1.music.126.net/ygxAeYxxXPONww041tylMw==/5996736418028563.jpg',
                },
                {
                    artist: 'Alan Walker',
                    lrc: '',
                    title: 'Fade',
                    src:
                        'http://music.163.com/song/media/outer/url?id=29947420.mp3',
                    pic:
                        'http://p2.music.126.net/6Skxbgl8cfIjFGV-MzGi0Q==/109951163787691327.jpg',
                },
                {
                    artist: '张茜',
                    lrc: '',
                    title: '用力活着',
                    src:
                        'http://isure.stream.qqmusic.qq.com/C400002bB5aL3osY5r.m4a?guid=1039805542&vkey=1FBEA113B7682E4519D6457A649E3E3ED08247551C7E4596C460B04F67E123AD589E815D20426F720A0EE4F18F72CDF3B9A0D88C35BDA265&uin=3653&fromtag=66',
                    pic:
                        'https://y.gtimg.cn/music/photo_new/T002R300x300M000002VMYeB3hF0MQ.jpg?max_age=2592000',
                },
                {
                    artist: '半吨兄弟',
                    lrc: '',
                    title: '飞蛾扑火',
                    src:
                        'http://music.163.com/song/media/outer/url?id=1425896216.mp3',
                    pic:
                        'http://p2.music.126.net/mup-bsgl1B6m1xn_TdPIyA==/109951164739729004.jpg',
                },
                {
                    artist: '金池',
                    lrc: '',
                    title: '谁不是',
                    src:
                        'http://isure.stream.qqmusic.qq.com/C400000BpgqG0CipeI.m4a?guid=1039805542&vkey=A3D1115EC0CB4E5A889ED36335269655390DE216F20C34EB36AEAD46FC181C971D8D092889471267A91D045B20788A4F5CDEE94043F2564E&uin=3653&fromtag=66',
                    pic:
                        'http://y.gtimg.cn/music/photo_new/T002R300x300M0000032Ykbb2hNsJn_1.jpg?max_age=2592000',
                },
            ]
        },
        getCode() {},
    },
    mounted() {
        this.userInfo = this.$store.state.userInfo
        window.sessionStorage.setItem('activePath', '/main');
       
        // alert(this.$)
        var roles = this.userInfo.isAdmin ? '超级管理员' : this.userInfo.roles
        this.tableInfo.push({
            userName: this.userInfo.userName,
            nickName: this.userInfo.nickName,
            department: this.userInfo.department,
            avatar: this.userInfo.avatar,
            roles: roles,
        })
    },
    created() {
        this.loadMusicList()
    },
}
</script>
<style lang="less" scoped>
.text {
    font-size: 14px;
}
.box-card {
    position: relative;
    bottom: 20px;
    right: 20px;
    margin: 20px;
}
.item {
    padding: 20px 0;
}

.box-card {
    width: 100%;
}
.el-col {
    padding: 10px;
}
.el-breadcrumb {
    font-size: 12px;
    margin-left: 15px;
}
.table {
    display: inline;
}
</style>
