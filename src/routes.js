import LogIn from "@/components/pages/LogIn.vue";
import RegisterUser from "@/components/pages/RegisterUser.vue";
import UserForm from "@/components/pages/UserForm.vue";
import NotFound from "@/components/pages/NotFound.vue";
import AddQuestion from "@/components/pages/AddQuestion.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: UserForm
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
    },
    {
        path: '/add-question',
        name: 'addQuestion',
        component: AddQuestion
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFound
    }
]

export default routes;