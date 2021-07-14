<template>
<div class="login-box">
  <div class="box">
    <h4 class="title is-4">Login to Server Management Panel</h4>
    <hr>
    <form @submit.prevent="attemptLogin">
      <b-field label="Username or Email">
        <b-input required v-model="username" icon="account" placeholder="johnsmith" />
      </b-field>
      <b-field label="Password">
        <b-input required v-model="password" icon="key" placeholder="hunter2" />
      </b-field>
      <b-field>
        <b-button tag="input" expanded native-type="submit" type="is-info" value="Login" />
      </b-field>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    attemptLogin() {
      fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
        .then(async(response) => {
          if (response.status === 200) {
            const json = await response.json()
            this.$store.commit('login', {
              username: json.user.username,
              email: json.user.email,
              sessionid: json.sessionId
            })
            this.$router.push('/')
          } else {
            try {
              const json = await response.json()
              this.$buefy.snackbar.open({
                type: 'is-danger',
                message: 'Failed to login: ' + json.error ? json.message : json
              })
            } catch (err) {
              this.$buefy.snackbar.open({
                type: 'is-danger',
                message: 'Failed to login: ' + response.statusText
              })
            }
          }
        })
        .finally(() => this.password = null)
    }
  }
}
</script>

<style scoped>
.login-box {
  margin: auto;
  width: 50%;
  padding: 10px;
  margin-top: 5%;
}
</style>
