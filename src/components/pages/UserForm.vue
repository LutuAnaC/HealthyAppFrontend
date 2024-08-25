<template>
  <Panel header="Va rugam raspundeti la urmatoarele intrebari:" class="mt-5">
    <div v-for="question in questions" :key="question.id">
      <div class="flex flex-row justify-content-start gap-2 m-3 align-items-center flex-wrap">
        <label>{{ question.question }}</label>
        <InputText v-if="question.possibleAnswers.length === 0" v-model="questionAnswers[question.id]"
                   id="question-text"
                   class="mr-3 ml-3 w-5"
        />
        <Dropdown v-else v-model="questionAnswers[question.id]"
                  :options="question.possibleAnswers"
                  placeholder="Selecteaza un raspuns"
                  class="ml-3" />
      </div>
    </div>
    <div class="flex flex-row justify-content-start">
      <Button label="Trimite Raspunsurile" class="mt-3" @click="submit" :disabled="formIsAlreadyCompleted"/>
    </div>
    <div class="flex flex-row align-items-start">
      <label v-if="formIsAlreadyCompleted" class="ml-3">Formularul a fost deja completat</label>
    </div>
    <Toast />
  </Panel>
</template>

<script>
import Panel from 'primevue/panel';
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import axiosRequestMaker from '../../requestMaker.js'
import requestMaker from "../../requestMaker.js";

export default {
  name: 'UserForm',
  components: {
    Panel,
    Dropdown,
    Button,
    Toast,
    InputText
  },
  data() {
    return {
      questionAnswers: [],
      questions: [],
      formIsAlreadyCompleted: false
    }
  },
  methods: {
    getQuestions() {
      axiosRequestMaker.get('https://webapihealth20240823092904.azurewebsites.net/api/question', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
          .then(response => {
            if (response.data.isSuccess === false) {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred',
                life: 3000
              })
              return
            }
            this.questions = response.data.data.map(question => {
              return {
                id: question.id,
                question: question.text,
                possibleAnswers: this.calculateQuestionPossibleAnswers(question)
              }
            });
          })
          .catch(() => {
            this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          });
    },
    calculateQuestionPossibleAnswers(question) {
      if (question.questionType === 0) {
        return ""
      } else if (question.questionType === 2) {
        return ['DA', 'NU']
      } else {
        return question.possibleAnswers.split(',')
      }
    },
    submit() {
      const allValid = this.questions.every(question => !!this.questionAnswers[question.id]);

      if (allValid) {
        axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/user-form', {
          userAnswers: this.questionAnswers.map((answer, index) => {
            return {
              questionId: index,
              answer: answer
            }
          }).filter(item => item !== null)
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Raspunsurile au fost trimise cu succes',
            life: 3000
          });
          setTimeout(() => {
            this.$router.push('/user-profile');
          }, 2000);
        }).catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000
          });
        });
      }
    },
    checkIfFormIsCompleted() {
      requestMaker.get('https://webapihealth20240823092904.azurewebsites.net/api/user-form/form-completed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
          if (response.data.data.isCompleted === true) {
            this.formIsAlreadyCompleted = true;
          }
        })
    }
  },
  beforeMount() {
    this.getQuestions();
    this.checkIfFormIsCompleted();
  }
}
</script>