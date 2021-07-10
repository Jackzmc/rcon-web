import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import '@/scss/main.scss'

Vue.use(Buefy)
Vue.config.productionTip = false

const defaultDocumentTitle = 'RCON Web Admin'

/* Collapse mobile aside menu on route change & set document title from route meta */
router.afterEach(to => {
  store.commit('asideMobileStateToggle', false)

  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
