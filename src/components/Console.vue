<template>
<div>
  <ul class="box has-background-black has-text-white console">
    <li v-for="line in lines" :key="line">
      {{line}}
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    lines: {
      type: Array
    }
  }
}
</script>

<style scoped>
.console {
  margin-bottom: 0.5em;
  height: 400px;
  border-radius: 0;
  overflow-y: scroll;
}
</style>
