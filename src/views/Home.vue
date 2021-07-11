<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-widget
          class="tile is-child"
          type="is-primary"
          icon="server"
          :number="serversOnline"
          label="Servers Online"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="account-group"
          :number="onlinePlayers"
          label="Players"
        />
        <card-widget
          class="tile is-child"
          type="is-danger"
          icon="alert-circle"
          :number="0"
          label="Errors"
        />
        <card-widget
          class="tile is-child"
          type="is-warning"
          icon="alert"
          :number="0"
          label="Warnings"
        />
      </tiles>

      <card-component
        title="Servers"
        icon="server"
        header-icon="reload"
        class="has-table has-mobile-sort-spaced"
        @header-icon-click="refreshServers"
      >
        <servers-table ref="servers"
          :servers="servers.list" :isLoading="servers.loading"
        />
      </card-component>
      <div class="columns">
        <div class="column">
          <card-component
            title="Players"
            icon="account-group"
          >
          <!-- TODO: Plot players OR cpu/mem? -->
            <div v-if="defaultChart.chartData" class="chart-area">
              <line-chart
                ref="bigChart"
                style="height: 100%;"
                chart-id="big-line-chart"
                :chart-data="defaultChart.chartData"
                :extra-options="defaultChart.extraOptions"
              >
              </line-chart>
            </div>
          </card-component>
        </div>
        <div class="column">
          <card-component
            title="Performance"
            icon="finance"
          >
          <!-- TODO: Plot players OR cpu/mem? -->
            <div v-if="defaultChart.chartData" class="chart-area">
              <line-chart
                ref="bigChart"
                style="height: 100%;"
                chart-id="big-line-chart"
                :chart-data="defaultChart.chartData"
                :extra-options="defaultChart.extraOptions"
              >
              </line-chart>
            </div>
          </card-component>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as chartConfig from '@/components/Charts/chart.config'
import LineChart from '@/components/Charts/LineChart'
import TitleBar from '@/components/TitleBar'
import Tiles from '@/components/Tiles'
import CardWidget from '@/components/CardWidget'
import CardComponent from '@/components/CardComponent'
import ServersTable from '@/components/ServersTable'
export default {
  name: 'Home',
  components: {
    ServersTable,
    CardComponent,
    CardWidget,
    Tiles,
    TitleBar,
    LineChart
  },
  data () {
    return {
      defaultChart: {
        chartData: null,
        extraOptions: chartConfig.chartOptionsMain
      },
      servers: {
        list: [],
        loading: false
      }
    }
  },
  computed: {
    titleStack () {
      return ['Dashboard']
    },
    serversOnline() {
      return this.servers.list.filter(a => a.status).length
    },
    onlinePlayers() {
      return this.servers.list.reduce((a, c) => a + c.players.length, 0)
    }
  },
  mounted () {
    this.fillChartData()
    this.refreshServers()

    this.$buefy.snackbar.open({
      message: 'Welcome back',
      queue: false
    })
  },
  methods: {
    refreshServers() {
      this.servers.loading = true
      fetch(`${this.$router.options.base}data-sources/servers.json`)
        .then(res => res.json())
        .then(json => this.servers.list = json.data)
        .finally(() => this.servers.loading = false)
    },
    randomChartData (n) {
      const data = []

      for (let i = 0; i < n; i++) {
        data.push(Math.round(Math.random() * 100))
      }

      return data
    },
    fillChartData () {
      this.defaultChart.chartData = {
        datasets: [
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          },
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.info,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          },
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.danger,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.danger,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.danger,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          }
        ],
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09']
      }
    }
  }
}
</script>
