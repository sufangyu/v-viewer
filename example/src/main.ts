import { createApp } from 'vue'

import 'viewerjs/dist/viewer.css'
import Viewer from '../../src/index'

import App from './App.vue'

createApp(App).use(Viewer).mount('#app')
