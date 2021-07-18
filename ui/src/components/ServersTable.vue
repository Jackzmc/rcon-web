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
        <b-tooltip label="You are the owner of this server" position="is-right">
          <b-icon v-if="props.row.owned" icon="crown"  size="is-small" />
        </b-tooltip>
        {{ props.row.name }}
      </b-table-column>
      <b-table-column label="Status" sortable :custom-sort="sortStatus" v-slot="props">
        <span class="has-text-success" v-if="props.row.details&&props.row.details.online">Online</span>
        <span class="has-text-danger" v-else>Offline</span>
      </b-table-column>
      <b-table-column label="Players" sortable :custom-sort="sortPlayers" v-slot="props">
        <template v-if="props.row.details&&props.row.details.online">
          {{ props.row.details.players.length }} / {{ props.row.details.maxplayers }}
        </template>
      </b-table-column>
      <b-table-column label="Created" v-slot="props">
        <small class="has-text-grey is-abbr-like" :title="props.row.created">{{ props.row.created }}</small>
      </b-table-column>
      <b-table-column custom-key="actions" cell-class="is-actions-cell" v-slot="props" header-class="mx-0 px-0">
        <div class="buttons is-right">
          <b-button tag="router-link" :to="'/server/' + props.row.id" size="is-small" type="is-info" >
            <span>View</span>
          </b-button>
          <!-- TODO: Check flags v-if -->
          <b-button tag="router-link" class="button is-small is-warning" type="button"
            :to="'/server/' + props.row.id + '/edit'"
          >
            <b-icon icon="lead-pencil" size="is-small"/>
            <span>Edit</span>
          </b-button>
          <b-tooltip type="is-danger" :active="!props.row.owned" label="You are not the owner of this server" position="is-left">
            <b-button :disabled="!props.row.owned" class="is-small is-danger" type="button" @click.prevent="trashModal(props.row)">
              <b-icon icon="trash-can" size="is-small"/>
              <span>Delete</span>
            </b-button>
          </b-tooltip>
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
    },
    servers: {
      type: Array
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isModalActive: false,
      trashObject: null,
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
  methods: {
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
        return b.details.players.length - a.details.players.length
      } else {
        return a.details.players.length - b.details.players.length
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
