import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    homepageCardData: null,
    cityList: null
  },
  mutations: {
    changeHomepageCardData: (state, data) => {
      state.homepageCardData = data;
    },
    changeCityList: (state, list) => {
      state.cityList = list;
    }
  },
  getters: {
    getHomepageCardData: state => (state.homepageCardData),
    getCityList: state => (state.cityList)
  },
  actions: {
    changeHomepageCardData(context, data) {
      context.commit('changeHomepageCardData', data)
    },
    changeCityList(context, data) {
      context.commit('changeCityList', data)
    }
  },
  modules: {
  }
})
