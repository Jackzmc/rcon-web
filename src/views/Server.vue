<template>
  <div>
    <hero-bar>
      Server {{$route.params.server}}
      <div class="buttons" slot="right">
        <b-button tag="router-link" slot="right" type="is-warning" icon-left="lead-pencil"
          :to="'/server/' + $route.params.server + '/edit'"
        >
          Edit Server
        </b-button>
        <b-button tag="router-link" slot="right" type="is-danger" icon-left="delete"
          :to="'/server/' + $route.params.server + '/delete'"
        >
          Delete
        </b-button>
      </div>

    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <profile-update-form class="tile is-child" />
        <card-component title="Profile" icon="account" class="tile is-child">
          <user-avatar class="image has-max-width is-aligned-center" />
          <hr />
          <b-field label="Name">
            <b-input :value="userName" custom-class="is-static" readonly />
          </b-field>
          <hr />
          <b-field label="E-mail">
            <b-input :value="userEmail" custom-class="is-static" readonly />
          </b-field>
        </card-component>
      </tiles>
      <password-update-form />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import ProfileUpdateForm from '@/components/ProfileUpdateForm'
import PasswordUpdateForm from '@/components/PasswordUpdateForm'
import Tiles from '@/components/Tiles'
import UserAvatar from '@/components/UserAvatar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Profile',
  components: {
    UserAvatar,
    HeroBar,
    Tiles,
    PasswordUpdateForm,
    ProfileUpdateForm,
    CardComponent
  },
  computed: {
    titleStack () {
      return ['Admin', 'Profile']
    },
    ...mapState(['userName', 'userEmail'])
  }
}
</script>
