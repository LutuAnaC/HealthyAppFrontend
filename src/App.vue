<template>
  <div>
    <HeaderMenu />
    <router-view />
  </div>
</template>

<script>
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
// import InputSwitch from 'primevue/inputswitch';
import HeaderMenu from "@/components/Header.vue";

export default {
  name: 'App',
  components: {
    HeaderMenu,
  }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

