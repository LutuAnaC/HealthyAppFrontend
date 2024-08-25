<template>
  <Panel header="Va rugam raspundeti la urmatoarele intrebari:" class="mt-5">
    <div v-for="question in questions" :key="question.id">
      <div class="flex flex-row justify-content-start gap-2 m-3 align-items-center flex-wrap">
        <label>{{ question.question }}</label>
        <Dropdown v-model="questionAnswers[question.id]"
                  :options="question.possibleAnswers"
                  optionLabel="answer"
                  placeholder="Selecteaza un raspuns"
                  class="ml-3" />
      </div>
    </div>
    <div class="flex flex-row justify-content-start">
      <Button label="Submit" class="mt-3" @click="submit"/>
    </div>
    <Toast />
  </Panel>
</template>

<script>
import Panel from 'primevue/panel';
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Toast from "primevue/toast";
import {jwtDecode} from 'jwt-decode';

export default {
  name: 'UserForm',
  components: {
    Panel,
    Dropdown,
    Button,
    Toast
  },
  data() {
    return {
      questionAnswers: [],
      questions: [
        {
          id: 1,
          question: 'Care este greutate dumneavoastra?',
          possibleAnswers: [
            {id: 1, answer: 'Sub 50 kg'},
            {id: 2, answer: '50-60 kg'},
            {id: 3, answer: '60-70 kg'},
            {id: 4, answer: '70-80 kg'},
            {id: 5, answer: '80-90 kg'},
            {id: 6, answer: 'peste 90 kg'}
          ]
        },
        {
          id: 2,
          question: 'Care este inaltimea dumneavoastra?',
          possibleAnswers: [
            {id: 1, answer: 'Sub 150 cm'},
            {id: 2, answer: '150-160 cm'},
            {id: 3, answer: '160-170 cm'},
            {id: 4, answer: '170-180 cm'},
            {id: 5, answer: 'peste 180 cm'}
          ]
        },
        {
          id: 3,
          question: 'Care este varsta dumneavoastra?',
          possibleAnswers: [
            {id: 1, answer: 'Sub 18 ani'},
            {id: 2, answer: '18-25 ani'},
            {id: 3, answer: '25-35 ani'},
            {id: 4, answer: '35-45 ani'},
            {id: 5, answer: 'peste 45 ani'}
          ]
        },
        {
          id: 4,
          question: 'Care este sexul dumneavoastra?',
          possibleAnswers: [
            {id: 1, answer: 'Feminin'},
            {id: 2, answer: 'Masculin'}
          ]
        },
        {
          id: 5,
          question: 'Care este nivelul de activitate fizica?',
          possibleAnswers: [
            {id: 1, answer: 'Sedentar'},
            {id: 2, answer: 'Activitate fizica moderata'},
            {id: 3, answer: 'Activitate fizica intensa'}
          ]
        }
      ]
    }
  },
  methods: {
    submit() {
      this.formSubmitted = true;

      const allValid = this.questions.every(question => !!this.questionAnswers[question.id]);

      if (allValid) {
        // Handle the form submission, e.g., send data to the server
        console.log('Form is valid. Submitting...', this.questionAnswers);
        // Reset formSubmitted flag if needed
        this.formSubmitted = false;
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please answer all questions',
          life: 3000
        });
      }
    }
  },
  created() {
    const encodedJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    console.log(jwtDecode(encodedJwt))
  }
}
</script>