import { createApp } from 'vue'
import App from './App.vue'
import routes from "@/routes";
import {createRouter, createWebHistory} from "vue-router";
import PrimeVue from 'primevue/config';


//in main.js


const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

app.use(router)
app.use(PrimeVue, {ripple: true});

app.mount('#app')
