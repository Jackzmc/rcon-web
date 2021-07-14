<template>
  <card-component title="Add New Server" icon="ballot"
    :header-icon="collapsed?'plus':'minus'"
    @header-icon-click="collapsed = !collapsed"
  >
    <template v-if="!collapsed">
    <form @submit.prevent="submit">
      <b-field label="From" horizontal>
        <b-field>
          <b-input
            icon="account"
            placeholder="Name"
            name="name"
            required
          />
        </b-field>
        <b-field>
          <b-input
            icon="email"
            type="email"
            placeholder="E-mail"
            name="email"
            required
          />
        </b-field>
      </b-field>
      <b-field message="Do not enter the leading zero" horizontal>
        <b-field>
          <p class="control">
            <a class="button is-static">
              +44
            </a>
          </p>
          <b-inputtype="tel" name="phone" expanded />
        </b-field>
      </b-field>
      <b-field label="Department" horizontal>
        <b-select
          placeholder="Select a department"
          required
        >
          <option
            v-for="(department, index) in departments"
            :key="index"
            :value="department"
          >
            {{ department }}
          </option>
        </b-select>
      </b-field>
      <hr />
      <b-field label="Subject" message="Message subject" horizontal>
        <b-input
          placeholder="e.g. Partnership proposal"
          required
        />
      </b-field>
      <b-field
        label="Question"
        message="Your question. Max 255 characters"
        horizontal
      >
        <b-input
          type="textarea"
          placeholder="Explain how we can help you"
          maxlength="255"
          required
        />
      </b-field>
      <hr />
      <b-field horizontal>
        <b-field grouped>
          <div class="control">
            <b-button native-type="submit" type="is-primary"
              >Submit</b-button
            >
          </div>
          <div class="control">
            <b-button type="is-primary is-outlined" @click="reset"
              >Reset</b-button
            >
          </div>
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
      collapsed: false
    }
  }
}
</script>
