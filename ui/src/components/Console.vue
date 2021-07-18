<template>
<div class="box has-background-black has-text-white console">
  <ul class="console-text">
    <li v-for="(line,i) in lines" :key="i">
      {{line}}
    </li>
  </ul>
  <div class="console-input-container">
    <b-input v-model="command" v-show="allowSend"
      icon="console-line" size="is-small"  type="text" class="console-input" placeholder="Enter a command"
      @keyup.enter.native="sendCommand"
    />
  </div>
</div>
</template>

<script>
export default {
  props: {
    allowSend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      command: null,
      lines: []
    }
  },
  methods: {
    sendCommand() {
      const command = this.command
      this.command = null
      fetch(`/api/servers/${this.$route.params.server}/command`, {
        method: 'POST',
        data: command
      })
        .then(response => {
          // Response should return RCON response, but logger should also catch it, so ignore
          if (response.ok) return
          this.$buefy.snackbar.open({
            type: 'is-danger',
            message: 'Could not send command: ' + response.statusText
          })
        })
        .catch(() => {
          this.$buefy.snackbar.open({
            type: 'is-danger',
            message: 'A network error occurred sending command'
          })
        })
    }
  },
  created() {
    const src = new EventSource(`/api/servers/${this.$route.params.server}/console`, {
      withCredentials: true
    })
    src.onerror = (event) => {
      console.error('[Console] Could not get live console, activating polling mode?')
    }
    src.addEventListener('close', (event) => {
      console.debug('received close event of reason:', event.data, 'terminating')
      src.close()
    })
    src.onmessage = (event) => {
      this.lines.push(event.data)
    }
  }
}
</script>

<style scoped>
.console {
  border-radius: 0;
  margin-bottom: 0.5em;
  padding-right: 0;
  padding-bottom: 0em;
  padding-top: .5em;
  padding-left: 0;
}
.console-text {
  margin-bottom: 0.5em;
  height: 400px;
  border-radius: 0;
  overflow-y: scroll;
  padding-left: .5em;
}
.console-input-container {
  position: sticky;
  left: 0;
  bottom: 0;
  margin: 0 !important;
}
.console-input {
  display: inline;
  border: none;
  outline:none;
  width: 100%;
  margin: 0 !important;
}
</style>
