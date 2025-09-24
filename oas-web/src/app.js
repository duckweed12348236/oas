import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './views/app.jsx'
import {router} from './extensions/router.js'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import '@/assets/css/common.css'

const app = createApp(App)


app.use(TDesign)
app.use(createPinia())
app.use(router)

app.mount('#app')
