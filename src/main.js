import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

import { useAuthStore } from './stores/auth.js'
import { useTestStore } from './stores/test.js'

const auth = useAuthStore()
const test = useTestStore()
auth.restoreUser()
test.restore()