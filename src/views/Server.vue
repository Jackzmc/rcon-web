<template>
  <div>
    <hero-bar>
      Server {{$route.params.server}}
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
      <tiles>
          <card-component title="Console" icon="console" class="tile is-child" contentClass="px-0 py-0">
            <console class="tile is-child" :lines="serverLines" />
            <div class="buttons px-3 pb-3 pt-1">
              <b-button icon-left="refresh" type="is-info">Restart</b-button>
            </div>
          </card-component>
          <card-component title="Server Information" icon="information" class="tile is-child">
            <hr />
            <b-field label="Name">
              <b-input :value="userName" custom-class="is-static" readonly />
            </b-field>
            <hr />
            <b-field label="E-mail">
              <b-input :value="userEmail" custom-class="is-static" readonly />
            </b-field>
          </card-component>
      </tiles>
      <password-update-form />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import PasswordUpdateForm from '@/components/PasswordUpdateForm'
import Tiles from '@/components/Tiles'
import HeroBar from '@/components/HeroBar'
import Console from '@/components/Console'
export default {
  name: 'Server',
  components: {
    HeroBar,
    Tiles,
    PasswordUpdateForm,
    CardComponent,
    Console
  },
  data() {
    return {
      serverLines: [
        "[SM] Changed cvar &quot;sv_maxupdaterate&quot; to &quot;100&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sv_maxupdaterate&quot;) (value &quot;100&quot;)",
        "[SM] Changed cvar &quot;sv_maxcmdrate&quot; to &quot;100&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sv_maxcmdrate&quot;) (value &quot;100&quot;)",
        "[SM] Changed cvar &quot;survivor_stun_immunity_duration&quot; to &quot;20&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;survivor_stun_immunity_duration&quot;) (value &quot;20&quot;)",
        "[SM] Changed cvar &quot;sb_friend_immobilized_reaction_time_hard&quot; to &quot;0.1&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sb_friend_immobilized_reaction_time_hard&quot;) (value &quot;0.1&quot;)",
        "[SM] Changed cvar &quot;sb_friend_immobilized_reaction_time_expert&quot; to &quot;0.1&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sb_friend_immobilized_reaction_time_expert&quot;) (value &quot;0.1&quot;)",
        "[SM] Changed cvar &quot;sb_sidestep_for_horde&quot; to &quot;1&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sb_sidestep_for_horde&quot;) (value &quot;1&quot;)",
        "[SM] Changed cvar &quot;sb_path_lookahead_range&quot; to &quot;350&quot;.L 07/10/2021 - 08:49:37: [basecommands.smx] &quot;Console&lt;0&gt;&lt;Console&gt;&lt;Console&gt;&quot; changed cvar (cvar &quot;sb_path_lookahead_range&quot;) (value &quot;350&quot;)",
        "Unknown command &quot;sm_spawnweapon_debug&quot;"
      ]
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
