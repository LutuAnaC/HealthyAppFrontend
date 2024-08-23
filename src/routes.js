import LogIn from "@/components/pages/LogIn.vue";
import RegisterUser from "@/components/pages/RegisterUser.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: LogIn
    },
    {
        path: '/login',
        name: 'login',
        component: LogIn
    },
    {
        path: '/register-user',
        name: 'registerUser',
        component: RegisterUser
    }
]

export default routes;