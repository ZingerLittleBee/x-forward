import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './index.css'
import AlertInstance from '@/plugins/alert'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(AlertInstance)
app.mount('#app')

export { app }
