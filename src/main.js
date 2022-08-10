import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



import Moment from 'moment'
  
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 为了通过接口获取菜单数据  通过axios请求拦截器添加token 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象，挂载添加token验证的Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 富文本编译器的注册为全局组件
Vue.use(VueQuillEditor)


//时间格式化过滤器
Vue.filter('formatDate', function (value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
}) 

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

