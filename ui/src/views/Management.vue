<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <add-server />
      <card-component title="Servers" icon="ballot-outline">
        <b-field label="Checkbox" class="has-check" horizontal>
          <checkbox-picker
            v-model="customElementsForm.checkbox"
            :options="{ lorem: 'Lorem', ipsum: 'Ipsum', dolore: 'Dolore' }"
            type="is-primary"
          />
        </b-field>
        <hr />
        <b-field label="Radio" class="has-check" horizontal>
          <radio-picker
            v-model="customElementsForm.radio"
            :options="{ one: 'One', two: 'Two' }"
          ></radio-picker>
        </b-field>
        <hr />
        <b-field label="Switch" horizontal>
          <b-switch v-model="customElementsForm.switch">
            Default
          </b-switch>
        </b-field>
        <hr />
        <b-field label="File" horizontal>
          <file-picker v-model="customElementsForm.file" />
        </b-field>
      </card-component>
    </section>
  </div>
</template>

<script>
import mapValues from 'lodash/mapValues'
import TitleBar from '@/components/TitleBar'
import CardComponent from '@/components/CardComponent'
import CheckboxPicker from '@/components/CheckboxPicker'
import RadioPicker from '@/components/RadioPicker'
import FilePicker from '@/components/FilePicker'
import AddServer from '@/components/AddServer'

export default {
  name: 'Forms',
  components: {
    FilePicker,
    RadioPicker,
    CheckboxPicker,
    CardComponent,
    AddServer,
    TitleBar
  },
  data () {
    return {
      isLoading: false,
      form: {
        name: null,
        email: null,
        phone: null,
        department: null,
        subject: null,
        question: null
      },
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      departments: ['Business Development', 'Marketing', 'Sales']
    }
  },
  computed: {
    titleStack () {
      return ['Dashboard', 'Server Management']
    }
  },
  methods: {
    submit () {},
    reset () {
      this.form = mapValues(this.form, (item) => {
        if (item && typeof item === 'object') {
          return []
        }
        return null
      })

      this.$buefy.snackbar.open({
        message: 'Reset successfully',
        queue: false
      })
    }
  }
}
</script>
