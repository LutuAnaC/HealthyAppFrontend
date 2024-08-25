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

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if ((to.path !== '/login' && to.path !== '/register-user') && !token) {
        next('/login');
    } else {
        next();
    }
});


app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);

app.mount('#app')
