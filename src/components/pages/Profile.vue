<template>
  <Panel header="User Profile">
    <div class="grid-container">
      <div class="left-panel">
        <Panel header="Formularul zilnic">
          <div v-for="question in dailyQuestions" :key="question.id"
               class="flex flex-row flex-wrap align-items-center justify-content-start mb-5">
            <div v-if="!(question.id == 5 && user.gender == 0)">
              <label class="mr-3">{{ question.question }}</label>
              <Calendar
                  v-if="question.id !== 5 && question.id !== 6"
                  v-model="dailyAnswers[question.id]"
                  dateFormat="dd/mm/yy"
                  showTime="true"
              />
              <Dropdown v-if="question.possibleAnswers && question.id === 5"
                        v-model="dailyAnswers[question.id]"
                        :options="question.possibleAnswers"
                        placeholder="Selecteaza un raspuns"/>

              <InputText v-if="!question.possibleAnswers && question.id === 6" v-model="dailyAnswers[question.id]"
                         placeholder="Raspuns"/>
            </div>
          </div>
          <Button label="Trimite" @click="submitDailyAnswers" :disabled="dailyFormAlreadyCompleted"/>
        </Panel>
      </div>
      <div class="right-panel">
        <Panel header="Istoric">
          <div class="flex flex-row flex-wrap align-items-center">
            <label class="mr-3">Selectati data:</label>
            <Calendar v-model="historyDate" dateFormat="dd/mm/yy" @dateSelect="showHistoryForm"/>
          </div>
          <div v-if="historyFormResults && historyDate">
            <div class="card flex justify-content-center">
              <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem"/>
            </div>
          </div>
          <div v-if="historyFormResults === null || historyDate === null"
               class="flex flex-row justify-content-start mt-5">
            <label v-if="historyFormResults === null">Nu exista date pentru ziua selectata!</label>
            <label v-if="historyDate === null">Introduceti o data pentru a vizualiza datele!</label>
          </div>
        </Panel>
      </div>
      <div class="bottom-panel">
        <Panel header="Usefull Data"></Panel>
      </div>
    </div>
    <Toast/>
  </Panel>
</template>

<script>
import Panel from 'primevue/panel';
import axiosRequestMaker from "@/requestMaker";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import requestMaker from "@/requestMaker";
import moment from "moment";
import Chart from "primevue/chart";
import {jwtDecode} from "jwt-decode";

// import moment from "moment";
export default {
  name: 'UserProfile',
  components: {
    Panel,
    Toast,
    Dropdown,
    InputText,
    Button,
    Calendar,
    Chart
  },
  data() {
    return {
      dailyQuestions: [],
      dailyAnswers: [],
      dailyFormAlreadyCompleted: false,
      historyDate: null,
      historyFormResults: [],
      chartData: null,
      chartOptions: {
        cutout: '60%'
      },
      userGender: 1
    }
  },
  methods: {
    getDailyQuestions() {
      axiosRequestMaker.get('https://webapihealth20240823092904.azurewebsites.net/api/daily-question', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
        if (response.data.isSuccess === false) {
          this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          return
        }

        this.dailyQuestions = response.data.data.map(question => {
          return {
            id: question.dailyQuestionId,
            question: question.text,
            possibleAnswers: question.isYesOrNoQuestion ? ['DA', 'NU'] : null
          }
        })
      }).catch(() => {
        // this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
      });
    },
    submitDailyAnswers() {
      axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/user-daily-question', {
        userAnswers: this.dailyAnswers.map((answer, index) => {
          return {
            dailyQuestionId: index,
            answer: index !== 5 && index !== 6 ? moment(answer).format('YYYY-MM-DDTHH:mm:ss') : answer
          }
        }).filter(answer => answer.answer !== null)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
        if (response.data.isSuccess === false) {
          this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          return
        }
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Raspunsurile au fost trimise cu succes',
          life: 3000
        })
        window.location.reload()
      }).catch(() => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
      })
    },
    checkIfDailyFormIsCompleted() {
      axiosRequestMaker.get(
          'https://webapihealth20240823092904.azurewebsites.net/api/user-daily-question/completed-today',
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
        if (response.data.data.isCompleted === true) {
          this.dailyFormAlreadyCompleted = true
        }
      }).catch(() => {
            this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          }
      )
    },
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
  },
  beforeMount() {
    this.getDailyQuestions()
    this.checkIfDailyFormIsCompleted()
    this.user = jwtDecode(localStorage.getItem('token'))
    console.log(this.user);
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