<template>
<div class="box has-background-black has-text-white console">
  <ul class="console-text">
    <li v-for="(line,i) in lines" :key="i">
      {{line}}
    </li>
  </ul>
  <div class="console-input-container">
    <b-input icon="console-line" size="is-small" v-model="command" type="text" class="console-input" placeholder="Enter a command" />
  </div>
</div>
</template>

<script>
export default {
  props: {
    lines: {
      type: Array
    }
  },
  data() {
    return {
      command: null
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
