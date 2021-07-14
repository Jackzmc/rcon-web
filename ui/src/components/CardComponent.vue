<template>
  <div class="card">
    <header v-if="title" class="card-header">
      <slot name="header">
        <p class="card-header-title">
          <b-icon v-if="icon" :icon="icon" custom-size="default" />
          {{ title }}
        </p>
        <a
          v-if="headerIcon"
          href="#"
          class="card-header-icon"
          aria-label="more options"
          @click.prevent="headerIconClick"
        >
          <b-icon :icon="headerIcon" custom-size="default" />
        </a>
      </slot>
    </header>
    <div :class="['card-content', ...contentClass]">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    title: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    headerIcon: {
      type: String,
      default: null
    },
    contentClass: {
      type: Array
    }
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
