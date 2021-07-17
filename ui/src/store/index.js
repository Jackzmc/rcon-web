import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

import { SnackbarProgrammatic as Snackbar } from 'buefy'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* User */
    user: {
      name: null,
      email: null,
      sessionid: null
    },
    servers: {
      list: [],
      loading: false
    },

    /* NavBar */
    isNavBarVisible: false,
    // isFooterBarVisible: true,
    isAsideVisible: false,
    isAsideMobileExpanded: false
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user (state, payload) {
      state.user.name = payload.username
      state.user.email = payload.email
      state.user.sessionid = payload.sessionId

      state.isNavBarVisible = true
      state.isAsideVisible = true
    },

    servers (state, payload) {
      if (payload.loading !== undefined) state.servers.loading = payload.loading
      if (payload.loading) state.servers.list = []
      if (payload.servers) {
        for (const server of payload.servers) {
          state.servers.list.push(server)
        }
      }
    },

    /* Aside Mobile */
    asideMobileStateToggle (state, payload = null) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null) {
        isShow = payload
      } else {
        isShow = !state.isAsideMobileExpanded
      }

      if (isShow) {
        document.documentElement.classList.add(htmlClassName)
      } else {
        document.documentElement.classList.remove(htmlClassName)
      }

      state.isAsideMobileExpanded = isShow
    }
  },
  actions: {
    validateSession({ commit }) {
      fetch('/api/auth/session')
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(json => {
                commit('user', {
                  username: json.user.username,
                  email: json.user.email,
                  sessionId: json.sessionId
                })
              })
          } else {
            router.push('/login')
          }
        })
        .catch(() => {
          router.push('/login')
        })
    },
    async refreshServers({ commit }) {
      commit('servers', {
        loading: true

      })

      try {
        const res = await fetch(`/api/servers?full=1`, {
          credentials: 'include'
        })
        if (res.ok) {
          const json = await res.json()
          commit('servers', {
            loading: false,
            servers: [...json.owned, ...json.shared]
          })
          return true
        }
        if (res.status === 401) router.push('/login')
        else Snackbar.open({
          type: 'is-danger',
          message: `Failed to acquire servers: ${res.statusText}`
        })
      } catch (err) {
        Snackbar.open({
          type: 'is-danger',
          message: `A network error occurred while fetching servers`
        })
      }
      commit('servers', { loading: false })
    }
  }
})
