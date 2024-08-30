<template>
  <Panel header="User Profile">
    <div class="grid-container">
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
import moment from "moment";
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
    Calendar
  },
  data() {
    return {
      dailyQuestions: [],
      dailyAnswers: [],
      dailyFormAlreadyCompleted: false,
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
  },
  beforeMount() {
    this.getDailyQuestions()
    this.checkIfDailyFormIsCompleted()
    this.user = jwtDecode(localStorage.getItem('token'))
    console.log(this.user);
  }
}
</script>