<template>
  <aside v-show="isAsideVisible" class="aside is-placed-left is-expanded">
    <aside-tools :is-main-menu="true">
      <span slot="label"> RCON Web Admin </span>
    </aside-tools>
    <div class="menu is-menu-main">
      <template v-for="(menus, category, i) in menu">
        <p :key="category + i" class="menu-label">
          {{ category }}
        </p>
        <aside-menu-list
          :key="category"
          :menu="menus"
        />
      </template>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import AsideTools from '@/components/AsideTools'
import AsideMenuList from '@/components/AsideMenuList'

export default {
  name: 'AsideMenu',
  components: { AsideTools, AsideMenuList },
  props: {
    menu: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState(['isAsideVisible'])
  }
}
</script>
