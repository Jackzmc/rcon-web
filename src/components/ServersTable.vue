<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObjectName"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <b-table
      :checked-rows.sync="checkedRows"
      :checkable="checkable"
      :loading="isLoading"
      :paginated="paginated"
      :per-page="perPage"
      :striped="true"
      :hoverable="true"
      default-sort="name"
      :data="servers"
      :show-header="servers.length > 0"
    >
      <b-table-column label="Name" field="name" sortable v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column label="Status" sortable :custom-sort="sortStatus" v-slot="props">
        <span class="has-text-success" v-if="props.row.status">Online</span>
        <span class="has-text-danger" v-else>Offline</span>
      </b-table-column>
      <b-table-column label="Players" sortable :custom-sort="sortPlayers">
        0 / 0
      </b-table-column>
      <b-table-column label="Created" v-slot="props">
        <small class="has-text-grey is-abbr-like" :title="props.row.created">{{ props.row.created }}</small>
      </b-table-column>
      <b-table-column custom-key="actions" cell-class="is-actions-cell" v-slot="props">
        <div class="buttons is-right">
          <router-link :to="{name:'client.edit', params: {id: props.row.id}}" class="button is-small is-primary">
            <b-icon icon="account-edit" size="is-small"/>
          </router-link>
          <button class="button is-small is-danger" type="button" @click.prevent="trashModal(props.row)">
            <b-icon icon="trash-can" size="is-small"/>
          </button>
        </div>
      </b-table-column>

      <section slot="empty" class="section">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large" />
            </p>
            <p>Fetching data...</p>
          </template>
          <template v-else>
            <p>
              No servers have been added.<br>
              Add one in the <router-link to="/manage">server management page</router-link>
            </p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>

<script>
import ModalBox from '@/components/ModalBox'

export default {
  name: 'ServersTable',
  components: { ModalBox },
  props: {
    dataUrl: {
      type: String,
      default: null
    },
    checkable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      servers: [],
      isLoading: false,
      paginated: false,
      perPage: 10,
      checkedRows: []
    }
  },
  computed: {
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject.name
      }

      return null
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh() {
      this.isLoading = true
      fetch(this.dataUrl)
        .then(res => res.json())
        .then(json => this.servers = json.data)
        .finally(() => this.isLoading = false)
    },
    sortStatus(a, b, ascending) {
      if (ascending) {
        if (a.status && !b.status) return -1
        else if (!a.status && b.status) return 1
        else return 0
      } else {
        if (a.status && !b.status) return 1
        else if (!a.status && b.status) return 0
        else return 0
      }
    },
    sortPlayers(a, b, ascending) {
      if (ascending) {
        return b.players.length - a.players.length
      } else {
        return a.players.length - b.players.length
      }
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isModalActive = false
      this.$buefy.snackbar.open({
        message: 'Confirmed',
        queue: false
      })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
