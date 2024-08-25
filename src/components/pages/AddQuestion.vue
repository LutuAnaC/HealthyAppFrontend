<template>
  <Panel header="Adauga intrebare:" class="mt-3">
    <div class="flex flex-column align-items-start gap-2 m-3">
      <div class=" flex flex-row align-items-center justify-content-start">
        <label for="username">Textul intrebarii:</label>
        <InputText v-model="questionText"
                   id="question-text"
                   class="mr-3 ml-3 w-full"
        />
      </div>
    </div>
    <div class="flex flex-column align-items-start gap-2 m-3">
      <div class=" flex flex-row align-items-center justify-content-start">
        <label for="username">Textul intrebarii:</label>
        <Dropdown v-model="questionType"
                  :options="questionTypeOptions"
                  optionLabel="text"
                  class="mr-3 ml-3 w-full md:w-14rem"
                  @change="onQuestionTypeSelect"
        />
      </div>
    </div>
    <div v-if="questionType !== null && questionType.value !== 0">
      <div  v-if="questionType.value !== 2" class="flex flex-row align-items-start gap-2 m-3">
        <div class=" flex flex-row align-items-center justify-content-start">
          <label for="username">Adauga raspun posibil:</label>
          <InputText v-model="possibleAnswerText"
                     id="question-text"
                     class="mr-3 ml-3 w-full"
          />
          <Button label="Adauga Raspuns posibil" class="w-5" @click="addPossibleAnswer"/>
        </div>
      </div>
      <div class="flex flex-column align-items-start">
        <div>Raspunsuri posibile:</div>
        <ul>
          <li v-for="(possibleAnswer, index) in possibleAnswers" :key="index">{{ possibleAnswer }}</li>
        </ul>
      </div>
    </div>

    <div class="flex flex-row align-items-start">
      <Button label="Adauga intrebare" class="mt-3" @click="addQuestion" />
    </div>
    <Toast />
  </Panel>
</template>

<script>
import Panel from 'primevue/panel';
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import questionTypes from '../QuestionType'
import Toast from "primevue/toast";
import axiosRequestMaker from '../../requestMaker.js'

export default {
  name: 'AddQuestion',
  components: {
    Panel,
    InputText,
    Dropdown,
    Button,
    Toast
  },
  data() {
    return {
      questionText: null,
      questionType: null,
      questionTypeOptions: questionTypes,
      possibleAnswerText: null,
      possibleAnswers: []
    }
  },
  methods: {
    addPossibleAnswer() {
      if (!this.possibleAnswers.includes(this.possibleAnswerText.trim())) {
        this.possibleAnswers.push(this.possibleAnswerText.trim());
        this.possibleAnswerText = '';
      }
    },
    onQuestionTypeSelect() {
      if (this.questionType.value === 1) {
        this.possibleAnswers = [this.questionText];
      } else if (this.questionType.value === 3) {
        this.possibleAnswers = ['DA', 'NU'];
      } else {
        this.possibleAnswers = [];
      }
    },
    addQuestion() {
      let isQuestionValid = this.validateQuestion() && this.validateQuestionType();
      if (!isQuestionValid) {
        return;
      }
      axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/question', {
        text: this.questionText,
        type: this.questionType.value,
        possibleAnswers: this.possibleAnswers
      },{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        console.log(response);
        this.$toast.add({severity:'success', summary: 'Success', detail: 'Intrebarea a fost adaugata cu succes', life: 3000});
        this.questionText = null;
        this.questionType = null;
        this.possibleAnswers = [];
      }).catch(() => {
        this.$toast.add({severity:'error', summary: 'Error', detail: 'A aparut o eroare la adaugarea intrebarii', life: 3000});
      });
    },
    validateQuestion() {
      if (!this.questionText) {
        this.$toast.add({severity:'error', summary: 'Error', detail: 'Intrebarea nu poate fi goala', life: 3000});
        return false;
      }
      return true;
    },
    validateQuestionType() {
      if (!this.questionType) {
        this.$toast.add({severity:'error', summary: 'Error', detail: 'Tipul intrebarii nu poate fi gol', life: 3000});
        return false;
      }
      return true;
    }
  }
}
</script>