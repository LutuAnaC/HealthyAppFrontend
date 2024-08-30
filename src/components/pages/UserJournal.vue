<template>
  <div class="w-full mt-5">
    <div class="grid-container">
      <div class="left-column">
        <div>
          <Panel header="Istoric jurnal">
            <ScrollPanel className="scroll-panel">
              <Fieldset v-for="(entry, index) in journalEntries" :key="index"
                        :legend="moment(entry.createdDate).format('YYYY-MM-DD HH:mm')"
                        :toggleable="true"
                        :collapsed="true">
                              <p class="m-0" style="color: var(--primary-color)">
                                {{ entry.text }}
                              </p>
              </Fieldset>
            </ScrollPanel>
          </Panel>
        </div>
      </div>
      <div class="right-column">
        <div class="flex justify-content-center align-item-center">
          <Panel header="Adauga inregistrare in jurnal">
            <div class="flex flex-column align-items-start gap-2 m-3">
              <div class="">

                <div>
                  <Textarea v-model="journalText"
                            rows="10" cols="100"
                            class="responsive-textarea ml-2"
                  />
                  <small v-if="journalTextError" id="journal-text-error-message" style="color: red">{{ journalTextError }}</small>
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
import Fieldset from "primevue/fieldset";
import axiosRequestMaker from "@/requestMaker";
import moment from "moment";
// import axiosRequestMaker from '../../requestMaker.js'

export default {
  name: 'UserJournal',
  computed: {
    moment() {
      return moment
    }
  },
  components: {
    Panel,
    Textarea,
    Button,
    Toast,
    ScrollPanel,
    Fieldset
  },
  data() {
    return {
      journalText: '',
      journalEntries: [],
      journalTextError: null
    }
  },
  methods: {
    addJournalEntry() {
      this.journalTextError = null;
      if (!this.validateJournalText()) {
        this.journalTextError = 'Textul inregistrarii este obligatoriu';
        return;
      }

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
              this.$toast.add({
                severity: 'success',
                summary: 'Succes',
                detail: 'Inregistrarea a fost adaugata cu succes',
                life: 3000
              });
              this.journalText = null;
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
    validateJournalText() {
      return this.journalText && this.journalText.length > 0;

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

.responsive-textarea {
  width: 100%;
  height: auto;
  min-height: 150px;
  padding: 10px;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  .scroll-panel {
    height: 50vh;
  }
  .responsive-textarea {
    min-height: 150px;
  }
}

.scroll-panel {
  width: 100%;
  height: 70vh;
}

@media (max-width: 1200px) {
  .scroll-panel {
    height: 60vh;
  }
  .responsive-textarea {
    min-height: 200px;
  }
}

@media (max-width: 480px) {
  .scroll-panel {
    height: 40vh; /* Adjust height for mobile devices */
  }
  .responsive-textarea {
    min-height: 100px;
  }
}
</style>