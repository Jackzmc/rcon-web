<template>
  <div>
    <hero-bar>
      {{server.name}}
      <p class="subtitle is-6" v-if="server.status">
        <span class="has-text-success">Online</span>
        <span> - {{server.players.length}} players online</span>
        <span> - 50 days uptime</span>
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
        <b-button tag="router-link" slot="right" type="is-danger" icon-left="delete"
          :to="'/server/' + $route.params.server + '/delete'"
        >
          Delete
        </b-button>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div class="column">
          <card-component title="Console" icon="console" contentClass="px-0 py-0">
            <console :lines="serverLines" />
            <div class="buttons px-3 pb-3 pt-1">
              <b-button icon-left="refresh" type="is-info">Restart</b-button>
            </div>
          </card-component>
        </div>
        <div class="column is-4">
          <card-component title="Server Information" icon="information" >
            <h5 class="title is-5">{{server.name}}</h5>
            <p class="subtitle is-6">{{server.meta.ip}}:{{server.meta.port}}</p>
            <hr />
            <h5 class="title is-5">Game</h5>
            <p class="subtitle is-6">{{server.meta.type}}</p>
            <hr />
            <b-field label="E-mail">
              <b-input :value="userEmail" custom-class="is-static" readonly />
            </b-field>
          </card-component>
        </div>
      </div>
      <server-tabs />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import Console from '@/components/Console'
import ServerTabs from '@/components/ServerTabs'
export default {
  name: 'Server',
  components: {
    HeroBar,
    CardComponent,
    Console,
    ServerTabs
  },
  data() {
    return {
      serverLines: [
        "*!* Beginning custom finale stage 6 of type 2                         [223/1976]",
        "*!* PendingWaitAdvance false, QueuedDelayAdvances 1",
        "Jackz ❤: it just keeps rolling",
        "*!* Update Advancing State finale stage 6 of type 2",
        "*!* PendingWaitAdvance false, QueuedDelayAdvances 1",
        "*!* Beginning custom finale stage 7 of type 1",
        "*!* PendingWaitAdvance true, QueuedDelayAdvances 0",
        "L 07/10/2021 - 17:32:26: [l4d2_skill_detect.smx] Clear: 6 freed 2 from 7: time: 2.16 / 2.20 -- class: smoker (with shove? 0)",
        "I Am The Liquor: pft",
        "*!* Beginning custom finale stage 8 of type 2",
        "*!* PendingWaitAdvance false, QueuedDelayAdvances 0",
        "*!* Beginning custom finale stage 9 of type -1",
        "*!* PendingWaitAdvance false, QueuedDelayAdvances 0",
        "Jackz ❤ attacked ha_banned",
        "L 07/10/2021 - 17:33:50: [basechat.smx] \"Jackz ❤<433><STEAM_1:0:49243767><>\" triggered sm_say (text maybe hell try to minigun the restarter)",
        "*!* EnableEscapeTanks finale stage 9 of type -1",
        "L 07/10/2021 - 17:34:20: [basechat.smx] \"Jackz ❤<433><STEAM_1:0:49243767><>\" triggered sm_say (text nop )",
        "ESCAPED: Francis",
        "ESCAPED: Louis",
        "ESCAPED: Francis"
      ],
      server: {
        status: true,
        players: [],
        name: 'server a',
        meta: {
          ip: '127.0.0.1',
          port: 27015,
          type: 'Left 4 Dead 2'
        }
      }
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Profile']
    },
    ...mapState(['userName', 'userEmail'])
  }
}
</script>
