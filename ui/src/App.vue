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
        Servers: this.$store.state.servers.list
          .map(server => {
            return {
              to: `/server/${server.id}`,
              icon: 'server',
              label: server.name
            }
          })
      }
    }
  },
  created () {
    if (this.$store.dispatch('validateSession')) {
      this.$store.dispatch('refreshServers')
    }
  }
}
</script>
