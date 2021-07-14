<template>
<card-component title="Test">
  <template slot="header">
    <div class="tabs">
      <ul>
        <li
          v-for="tab in $options.TABS"
          :key="tab"
          :class="{'is-active': activeTab === tab}"
        >
          <a @click="selectTab(tab)">{{tab}}</a>
        </li>
      </ul>
    </div>
  </template>
  <div v-if="activeTab == 'General'">
    <server-general />
  </div>
  <div v-if="activeTab == 'Logs'">
    <server-logs />
  </div>
  <div v-if="activeTab == 'Files'">
    <server-files />
  </div>
</card-component>
</template>

<script>
import CardComponent from '@/components/CardComponent'

import ServerFiles from '@/components/server/ServerFiles'
import ServerLogs from '@/components/server/ServerLogs'
import ServerGeneral from '@/components/server/ServerGeneral'

export default {
  name: 'ServerTabs',
  TABS: [
    "General",
    "Logs",
    "Files"
  ],
  components: {
    CardComponent,
    ServerGeneral,
    ServerLogs,
    ServerFiles
  },
  data () {
    return {
      isLoading: false,
      form: {
        password_current: null,
        password: null,
        password_confirmation: null
      },
      activeTab: 'General'
    }
  },
  methods: {
    selectTab(tab) {
      this.activeTab = tab
    },
    submit () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.$buefy.snackbar.open(
          {
            message: 'Updated',
            queue: false
          },
          500
        )
      })
    }
  }
}
</script>
