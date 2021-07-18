<template>
<div>
  <div v-if="server">
    <hero-bar>
      <span class=" is-uppercase">{{server.name}}</span>
      <p class="subtitle is-6" v-if="server.details && server.details.online">
        <span class="has-text-success">Online</span>
        <span> - {{server.details.players.length}} players online</span>
      </p>
      <p class="subtitle is-6" v-else>
        <span class="has-text-danger">Offline</span>
      </p>
      <div class="buttons" slot="right">
        <b-button tag="router-link" slot="right" type="is-warning" icon-left="lead-pencil"
          :to="'/server/' + $route.params.server + '/edit'"
        >
          Edit Server
        </b-button>
        <b-button  slot="right" type="is-danger" icon-left="delete"
          @click="deleteServer"
        >
          Delete
        </b-button>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div class="column">
          <card-component title="Console" icon="console" contentClass="px-0 py-0">
            <console />
            <div class="buttons px-3 pb-3 pt-0">
              <b-button icon-left="refresh" type="is-info">Restart</b-button>
            </div>
          </card-component>
        </div>
        <div class="column is-4">
          <card-component title="Server Information" icon="information" >
            <h5 class="title is-5 is-uppercase">{{server.name}}</h5>
            <p class="subtitle is-6">
              {{ connectIP }}
              <a class="is-pulled-right" :href="'steam://connect/' + connectIP">Connect</a>
            </p>
            <hr />
            <h5 class="title is-5">Game</h5>
            <p class="subtitle is-6">
              {{ serverType }}
              <span class="is-pulled-right">{{server.details ? server.details.version : null}}</span>
            </p>
            <template v-if="server.owned">
              <hr />
              <h5 class="title is-5">
                <b-icon icon="lock" />
                Permissions
              </h5>
              Shared with {{ server.sharedWith.length }} people
            </template>
            <template v-else>
              <hr />
              <h5 class="title is-5">
                <b-icon icon="lock" />
                Permissions
              </h5>
              Not implemented
            </template>
            <template v-if="server.tags.length > 0">
              <hr />
              <div class="tags">
                <b-tag type="is-dark" v-for="tag in server.tags" :key="tag">{{tag}}</b-tag>
              </div>
            </template>
          </card-component>
          <card-component title="Players" icon="account-group" v-if="server.details">
            <p v-if="!server.details.online">Server is offline</p>
            <p v-if="server.details.players.length == 0">No players are online</p>
            <div class="columns is-multiline" v-else>
              <div class="column is-6 px-0 py-0" v-for="player in server.details.players" :key="player.steamid">
                <a class="px-2 py-2 mx-0 my-0 player">
                  {{player.name}}
                </a>
              </div>
            </div>
          </card-component>
        </div>
      </div>
      <server-tabs />
    </section>
  </div>
  <div v-else class="container px-5 py-5">
    <div class="box">
      <h3 class="title is-3">Server Not Found</h3>
      <p class="subtitle is-6">That server does not exist or you do not have permission to view that server.</p>
      <hr />
      <b-button tag="router-link" to="/" type="is-info"> Return to Dashboard </b-button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import Console from '@/components/Console'
import ServerTabs from '@/components/ServerTabs'
import AppTitles from '@/assets/appid_titles.json'

export default {
  name: 'Server',
  components: {
    HeroBar,
    CardComponent,
    Console,
    ServerTabs
  },
  AppTitles,
  data() {
    return {

    }
  },
  computed: {
    connectIP() {
      return this.server ? this.server.ip + ":" + this.server.port : null
    },
    titleStack () {
      return ['Admin', 'Profile']
    },
    server() {
      return this.$store.state.servers.list.find(server => server.id === this.$route.params.server)
    },
    serverType() {
      if (!this.server?.details) return "Server cannot be reached"
      if (!this.server.details.online) return 'Server Offline'
      return this.$options.AppTitles[this.server.details.appid] || 'Unknown'
    },
    ...mapState(['user'])
  },
  methods: {
    deleteServer() {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete <b>${this.server.name}</b>?<br>This operation cannot be undone.`,
        confirmText: 'Yes',
        cancelText: 'No',
        type: 'is-danger'
      })
    }
  }
}
</script>

<style>
a.player {
  display: inline-block;
}
a.player:hover {
  background-color: rgba(227, 238, 238, 0.36) !important;
  width: 100%;
  display: inline-block;
}
</style>
