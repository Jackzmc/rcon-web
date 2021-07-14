<template>
  <div class="is-user-avatar">
    <img :src="avatarURL" :alt="user.name" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserAvatar',
  computed: {
    avatarURL() {
      return `https://avatars.dicebear.com/api/initials/${this.user.name}.svg`
    },
    ...mapState(['user'])
  }
}
</script>
