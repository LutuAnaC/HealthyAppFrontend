<template>
  <div class="card" v-if="route !== 'login' && route !== 'registerUser' && route !== 'notFound'">
    <Menubar :model="items">
      <template #start>
      </template>
      <template>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <label>Dark Mode:</label>
          <InputSwitch v-model="darkModeChecked" @click="switchTheme" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script>
import InputSwitch from "primevue/inputswitch";
import Menubar from "primevue/menubar";
import {jwtDecode} from "jwt-decode";

export default {
  name: 'HeaderMenu',
  components: {
    InputSwitch,
    Menubar
  },
  data() {
    return {
      user: null,
      currentTheme: 'aura-light-amber',
      route: '',
      darkModeChecked: false,
      items: [
        {
          label: 'Deconectare',
          icon: 'pi pi-sign-out',
          command: () => {
            localStorage.removeItem('token');
            this.$router.push('/login');
          }
        }
      ]
    };
  },
  methods: {
    switchTheme() {
      this.currentTheme = this.currentTheme === 'aura-light-amber' ? 'aura-dark-amber' : 'aura-light-amber';
      this.changeTheme();
    },
    changeTheme() {
      const existingLink = document.getElementById('theme-link');
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = 'theme-link';
      link.rel = 'stylesheet';
      link.href = `/${this.currentTheme}/theme.css`;
      document.head.appendChild(link);

      localStorage.setItem('theme', this.currentTheme);
    },
    updateRoute() {
      this.route = this.$route.name || ''; // Get the current route name
      console.log(this.route);
    }
  },
  mounted() {
    this.updateRoute();

    this.$watch('$route', () => {
      this.updateRoute();
    });

    if (localStorage.getItem('token') !== null) {
      this.user = jwtDecode(localStorage.getItem('token'));
      if (this.user.role === 'admin') {
        this.items = [
          ...this.items,
          {
            label: 'Adauga o intrebare',
            icon: 'pi pi-link',
            command: () => {
              this.$router.push('/add-question');
            }
          },
          {
            label: 'Sterge o intrebare',
            icon: 'pi pi-link',
            command: () => {
              this.$router.push('/delete-question');
            }
          },
        ]
      } else {
        this.items = [
          {
            label: 'Jurnal',
            icon: 'pi pi-book',
            command: () => {
              this.$router.push('/user-journal');
            }
          },
          {
            label: 'Intrebari zilnice',
            icon: 'pi pi-question',
            command: () => {
              this.$router.push('/user-profile');
            }
          },
          {
            label: 'Istoricul Intrebarilor Zilnice',
            icon: 'pi pi-history',
            command: () => {
              this.$router.push('/daily-questions-history');
            }
          },
          ...this.items
        ]
      }
    }
  },
  beforeMount() {
    this.currentTheme = localStorage.getItem('theme') || 'aura-light-amber';
    this.darkModeChecked = this.currentTheme === 'aura-dark-amber';
    this.changeTheme();
    this.updateRoute();
  }
}
</script>