import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './styles/global.less'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

app.mount('#app')
