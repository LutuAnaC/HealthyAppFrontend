import LogIn from "@/components/pages/LogIn.vue";
import RegisterUser from "@/components/pages/RegisterUser.vue";
import UserForm from "@/components/pages/UserForm.vue";
import NotFound from "@/components/pages/NotFound.vue";
import AddQuestion from "@/components/pages/AddQuestion.vue";
import DeleteQuestion from "@/components/pages/DeleteQuestion.vue";
import UserProfile from "@/components/pages/DailyQuestion.vue";
import UserJournal from "@/components/pages/UserJournal.vue";
import History from "@/components/pages/DailyQuestionsHistory.vue";

const routes = [
    {
        path: '/',
        name: 'userForm',
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
        path: '/delete-question',
        name: 'deleteQuestion',
        component: DeleteQuestion
    },
    {
        path: '/user-profile',
        name: 'userProfile',
        component: UserProfile
    },
    {
        path: '/user-journal',
        name: 'userJournal',
        component: UserJournal
    },
    {
        path: '/daily-questions-history',
        name: 'dailyQuestionsHistory',
        component: History
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFound
    }
]

export default routes;