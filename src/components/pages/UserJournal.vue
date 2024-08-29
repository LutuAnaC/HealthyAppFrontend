<template>
  <div class="w-full mt-5">
    <div class="grid-container">
      <div class="left-column">
        <div>
          <ScrollPanel style="width: 100%; height: 200px">
            <p v-for="(entry, index) in journalEntries" :key="index" style="color: var(--primary-color)">
                {{ entry.text }}
            </p>
          </ScrollPanel>
        </div>
      </div>
      <div class="right-column">
        <div class="flex justify-content-center align-item-center">
          <Panel header="Adauga inregistrare in jurnal">
            <div class="flex flex-column align-items-start gap-2 m-3">
              <div class="">

                <div class="flex justify-content-center align-items-center">
                  <label for="username">Textul inregistrarii:</label>
                  <Textarea v-model="journalText"
                            rows="10" cols="40"
                            class="ml-2"
                  />
                </div>

              </div>
            </div>
            <div class="flex flex-row align-items-start">
              <Button label="Adauga inregistrare" class="mt-3" @click="addJournalEntry"/>
            </div>
            <Toast/>
          </Panel>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import Panel from "primevue/panel";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ScrollPanel from "primevue/scrollpanel";
import axiosRequestMaker from "@/requestMaker";
// import axiosRequestMaker from '../../requestMaker.js'

export default {
  name: 'UserJournal',
  components: {
    Panel,
    Textarea,
    Button,
    Toast,
    ScrollPanel
  },
  data() {
    return {
      journalText: '',
      journalEntries: []
    }
  },
  methods: {
    addJournalEntry() {
      axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/user-journal', {
        text: this.journalText
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
          .then(response => {
            if (response.data.isSuccess === false) {
              this.$toast.add({
                severity: 'error',
                summary: 'Eroare',
                detail: response.data.message,
                life: 3000
              });
            } else {
              this.journalText = '';
              this.getJournalEntries();
            }
          })
          .catch(() => {
            this.$toast.add({
              severity: 'error',
              summary: 'Eroare',
              detail: 'A aparut o eroare la adaugarea inregistrarii',
              life: 3000
            });
          })
    },
    getJournalEntries() {
      axiosRequestMaker.get('https://webapihealth20240823092904.azurewebsites.net/api/user-journal/entries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
          .then(response => {
            if (response.data.isSuccess === false) {
              this.$toast.add({
                severity: 'error',
                summary: 'Eroare',
                detail: 'A aparut o eroare la aducerea inregistrarilor',
                life: 3000
              });
              return;
            }
            this.journalEntries = response.data.data.map(entry => {
              return {
                text: entry.text,
                createdDate: entry.createdDate
              }
            });
          })
          .catch(() => {
            this.$toast.add({
              severity: 'error',
              summary: 'Eroare',
              detail: 'A aparut o eroare la aducerea inregistrarilor',
              life: 3000
            });
          })
    }
  },
  mounted() {
    this.getJournalEntries()
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Două coloane egale */
  gap: 20px; /* Distanța dintre coloane */
}

.left-column {
  padding: 20px;
}

.right-column {
  padding: 20px;
}

</style>