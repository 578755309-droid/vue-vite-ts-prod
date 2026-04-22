import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')
