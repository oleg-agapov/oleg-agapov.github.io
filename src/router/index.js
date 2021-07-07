import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/pages/Home.vue'
import CV from '/src/pages/CV.vue'
import DeBook from '/src/pages/DeBook.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/cv',
        name: 'CV',
        component: CV,
    },
    {
        path: '/de-book',
        name: 'DeBook',
        component: DeBook,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
