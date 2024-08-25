import { createApp } from 'vue'
import App from './App.vue'
import routes from "@/routes";
import {createRouter, createWebHistory} from "vue-router";
import PrimeVue from 'primevue/config';

import ToastService from 'primevue/toastservice';

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    base: '/',
    routes: routes
})

app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);

app.mount('#app')
