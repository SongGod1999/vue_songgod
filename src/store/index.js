import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate' //首先引入

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [persistedState ()] ,
  state: {
    userInfo: {},
    activePath: '/main'
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {},
  modules: {},
})
