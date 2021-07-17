<template>
  <card-component title="Add New Server" icon="ballot"
    :header-icon="collapsed?'plus':'minus'"
    @header-icon-click="collapsed = !collapsed"
  >
    <template v-if="!collapsed">
    <form @submit.prevent="submit">
      <b-field label="Server Name" horizontal>
        <b-field :message="idName">
          <b-input
            v-model="form.name"
            icon="format-title"
            placeholder="Server Name"
            required
          />
        </b-field>
      </b-field>
      <b-field label="File Directory" horizontal>
        <b-field message="Path is required for log access">
          <b-input
            v-model="form.directory"
            icon="folder"
            placeholder="/home/steam/my-server-folder/"
            required
          />
        </b-field>
      </b-field>
      <b-field label="IP:Port" horizontal>
        <b-field message="Need for RCON connection">
          <b-input
            v-model="form.ip"
            placeholder="localhost"
            required
          />
        </b-field>
        <b-field>
          <b-input
            v-model="form.port"
            placeholder="27015"
            required
          />
        </b-field>
      </b-field>
      <b-field label="RCON Password" horizontal>
        <b-field>
          <b-input
            v-model="form.rcon_password"
            icon="key"
            placeholder=""
            required
          />
        </b-field>
      </b-field>
      <b-field horizontal>
        <b-field>
          <b-button
            :loading="form.loading"
            tag="input"
            native-type="submit"
            type="is-info"
            value="Add Server"
          />
        </b-field>
      </b-field>
    </form>
    </template>
  </card-component>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'AddServer',
  components: {
    CardComponent
  },
  data() {
    return {
      collapsed: false,
      form: {
        name: null,
        directory: null,
        ip: null,
        port: 27015,
        rcon_password: null,
        loading: false
      }
    }
  },
  computed: {
    idName() {
      if (!this.form.name) return
      const id = this.form.name
        .replace(/[^a-zA-Z0-9-]/, '')
        .replace(/\s/, '-')

      return `ID will be ${id}`
    }
  },
  methods: {
    submit() {
      this.loading = true
      fetch(`/api/servers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.form.name,
          directory: this.form.directory,
          ip: this.form.ip,
          port: this.form.port,
          rcon_password: this.form.rcon_password
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.result !== "SUCCESS") {
            const message = json.message ? `${json.code} - ${json.message}` : json.code
            this.$buefy.dialog.alert({
              type: 'is-danger',
              title: 'Error',
              message: `<b>Server returned an error:</b><br>${message}`
            })
          } else {
            this.form = {
              name: null,
              directory: null,
              ip: null,
              port: 27015,
              rcon_password: null,
              loading: false
            }
            this.$buefy.snackbar.open({
              type: 'is-success',
              message: `Successfully created server`,
              actionText: 'View',
              onAction: () => {
                this.$router.push(`/server/${json.id}`)
              }
            })
          }
        })
        .catch(() => {
          this.$buefy.dialog.alert({
            type: 'is-danger',
            title: 'Error',
            message: `A network error occurred while submitting.`
          })
        })
        .finally(() => this.loading = false)
    }
  }
}
</script>
