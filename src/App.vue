<template>
  <div id="app">
    <nav-bar />
    <aside-menu :menu="menu" />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'

export default {
  name: 'App',
  components: {
    AsideMenu,
    NavBar
  },
  computed: {
    menu () {
      return {
        General: [
          {
            to: '/',
            icon: 'desktop-mac',
            label: 'Dashboard'
          },
          {
            to: '/management',
            icon: 'database',
            label: 'Server Management'
          },
          {
            to: '/settings',
            icon: 'settings',
            label: 'Settings'
          }
        ],
        Servers: [
          {
            to: '/server/a',
            icon: 'server',
            label: 'Server 1'
          },
          {
            to: '/server/2',
            icon: 'server',
            label: 'Server 2'
          }
        ]
      }
    }
  },
  created () {
    this.$store.commit('user', {
      name: 'John Doe',
      email: 'john@example.com'
    })
  }
}
</script>
