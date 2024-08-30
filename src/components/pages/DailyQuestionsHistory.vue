<template>
  <div class="grid-container">
    <div class="left-panel">
      <Panel header="Rezultate">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem"/>
        <div v-if="historyFormResults === null || historyDate === null"
             class="flex flex-row justify-content-start mt-5">
          <label v-if="historyFormResults === null">Nu exista date pentru ziua selectata!</label>
          <label v-if="historyDate === null">Introduceti o data pentru a vizualiza datele!</label>
        </div>
      </Panel>
    </div>
    <div class="right-panel">
      <Panel header="Istoric">
        <div class="flex flex-row flex-wrap align-items-center">
          <label class="mr-3">Selectati data:</label>
          <Calendar v-model="historyDate" dateFormat="dd/mm/yy" @dateSelect="showHistoryForm"/>
        </div>
      </Panel>
    </div>
  </div>
</template>
<script>
import Panel from "primevue/panel";
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";
import moment from "moment/moment";
import requestMaker from "@/requestMaker";

export default {
  name: 'dailyQuestionsHistory',
  components: {
    Panel,
    Calendar,
    Chart
  },
  data() {
    return {
      historyDate: null,
      historyFormResults: [],
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
    }
  },
  methods: {
    showHistoryForm() {
      requestMaker.get(
          `https://webapihealth20240823092904.azurewebsites.net/api/user-daily-question/${moment(this.historyDate).format('YYYY-MM-DD')}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
      ).then(response => {
        if (response.data.isSuccess === false) {
          this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          return
        }
        if (response.data.data.length !== 0) {
          this.historyFormResults = response.data.data
        } else {
          this.historyFormResults = null
        }

        this.chartData = this.setChartData();
      }).catch(() => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
      })
    },
    setChartData() {
      if (!this.historyFormResults) {
        return null;
      }
      const documentStyle = getComputedStyle(document.body);
      let sleptHours = 0;
      let hoursOfEating = 0;
      let remainingHours = 0;

      // this.sleptHours = moment(this.historyFormResults.find(result => result.dailyQuestionId === 0).answer)->diff(moment(this.historyFormResults.find(result => result.dailyQuestionId === 1).answer), 'hours');
      sleptHours = moment.duration(moment(this.historyFormResults.find(result => result.dailyQuestionId === 1).answer).diff(moment(this.historyFormResults.find(result => result.dailyQuestionId === 2).answer))).asHours();
      hoursOfEating = moment.duration(moment(this.historyFormResults.find(result => result.dailyQuestionId === 4).answer).diff(moment(this.historyFormResults.find(result => result.dailyQuestionId === 3).answer))).asHours();
      remainingHours = 24 - sleptHours - hoursOfEating;

      return {
        labels: ['Ore Dormite', 'Ore in care s-a mancat', 'Fasting'],
        datasets: [
          {
            data: [sleptHours, hoursOfEating, remainingHours],
            backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
          }
        ]
      };
    },
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  grid-template-rows: 1fr auto; /* Main row takes remaining space, bottom row has auto height */
  height: 100vh; /* Full viewport height */
  gap: 10px; /* Optional: Add space between panels */
  padding: 10px; /* Optional: Add padding around the grid */
}

.left-panel {
  grid-column: 1 / 2; /* Spans the first column */
  padding: 20px;
}

.right-panel {
  grid-column: 2 / 3; /* Spans the second column */
  padding: 20px;
}

.bottom-panel {
  grid-column: 1 / 3; /* Spans both columns */
  padding: 20px;
  height: 100px; /* Fixed height */
}

/* Responsive Design */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* Single column layout */
    grid-template-rows: auto auto auto; /* Each panel takes its own row */
    height: auto; /* Let the height adjust based on content */
  }

  .left-panel, .right-panel, .bottom-panel {
    grid-column: 1 / 2; /* All panels span across the single column */
    height: auto; /* Allow height to adjust based on content */
  }

  .bottom-panel {
    height: auto; /* Remove the fixed height for responsiveness */
  }
}
</style>