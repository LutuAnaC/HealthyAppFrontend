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

export default {
  name: 'HeaderMenu',
  components: {
    InputSwitch,
    Menubar
  },
  data() {
    return {
      currentTheme: 'aura-light-amber',
      route: '',
      darkModeChecked: false,
      items: [
        {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/introduction');
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
    this.updateRoute();  // Update the route when the component is mounted

    this.$watch('$route', () => {
      this.updateRoute();
    });
  },
  beforeMount() {
    this.currentTheme = localStorage.getItem('theme') || 'aura-light-amber';
    this.darkModeChecked = this.currentTheme === 'aura-dark-amber';
    this.changeTheme();
  }
}
</script>