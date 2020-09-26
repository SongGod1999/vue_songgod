import Vue from 'vue'
import SlideVerify from 'vue-monoplasty-slide-verify' // 拼图验证码
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import App from './App.vue'
import store from './store'
import router from './router/router'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import '@/assets/icon/iconfont.css'

// 导入全局样式
import './assets/css/global.css'
import axios from 'axios'
import { hasPermission } from './utils/permissionDirect'
NProgress.configure({ showSpinner: false })
NProgress.configure({ ease: 'ease', speed: 500 })
NProgress.configure({ minimum: 0.3 })
Vue.use(SlideVerify)

// 配置axios根路径https://www.songgod.cn/api'
axios.defaults.baseURL = 'http://127.0.0.1:8081'

const Plugins = [hasPermission]
Plugins.map((plugin) => {
  Vue.use(plugin)
})
axios.interceptors.request.use(config => {
  NProgress.start() // 设置加载进度条(开始..)
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/**
 * axios响应拦截器
 */
axios.interceptors.response.use(
  function (response) {
    NProgress.done() // 设置加载进度条(结束..)
    if (response.data.code === 4001) { // 如果返回的code==4001说明token错误或者token过期
      window.localStorage.clear()
      // var vm=new Vue();
      // vm.$message.error("您的登入状态已失效,请您重新登入~")
      return router.push('/login')
    } else {
        return response
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
