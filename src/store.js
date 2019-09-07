import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    views: {
      drawer: true
    }
  },
  mutations: {
    toggle_drawer (state) {
      state.views.drawer = !state.views.drawer
    }
  },
  actions: {

  }
})
