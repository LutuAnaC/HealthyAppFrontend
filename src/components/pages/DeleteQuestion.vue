<template>
  <Panel header="Sterge o intrebare:" class="mt-3">
    <div class="flex flex-wrap align-items-center">
      <div>Alegeti intrebarea care urmeaza a fi stearsa:</div>
      <Dropdown v-model="selectedQuestion"
                :options="questionOptions"
                optionLabel="label"
                placeholder="Selecteaza o intrebare" class="w-4 ml-2"/>
    </div>
    <div class="flex flex-row align-items-left">
      <Button label="Sterge Intrebarea" class="mt-3" @click="deleteQuestion"/>
    </div>
  </Panel>
  <Toast/>
</template>

<script>
import axiosRequestMaker from '../../requestMaker.js'
import Toast from 'primevue/toast';
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

export default {
  name: 'DeleteQuestion',
  components: {
    Toast,
    Panel,
    Dropdown,
    Button
  },
  data() {
    return {
      questionOptions: [],
      selectedQuestion: null
    };
  },
  methods: {
    async getQuestions() {
      await axiosRequestMaker.get('https://webapihealth20240823092904.azurewebsites.net/api/question', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
          .then(response => {
            if (response.data.data.isSuccess == false) {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.data.errorMessages[0],
                life: 3000
              })
              return
            }
            this.questionOptions = response.data.data.map(question => {
              return {
                label: question.text,
                value: question.id
              }
            });
          })
          .catch(() => {
            this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
          });
    },
    deleteQuestion() {
      axiosRequestMaker.delete(`https://webapihealth20240823092904.azurewebsites.net/api/question/` + this.selectedQuestion.value, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
        if (response.data.isSuccess == false) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
            life: 3000
          })
          return
        }
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Intrebarea a fost stearsa cu succes',
          life: 3000
        });
        this.getQuestions();
      }).catch(() => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
      });
    }
  },
  beforeMount() {
    this.getQuestions();
  }
};
</script>