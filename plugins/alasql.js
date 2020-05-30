import alasqlJs from '../node_modules/alasql/dist/alasql.min.js'
import Vue from 'vue'
const alasql = {
  install (v) {
    Vue.prototype.alasql = alasqlJs
  }
}
Vue.use(alasql)