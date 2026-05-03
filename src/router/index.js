import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTestStore } from '../stores/test.js'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/TestView.vue'),
        meta: { requiresAuth: true, requiresInProgress: true },
    },
    {
        path: '/review',
        name: 'review',
        component: () => import('../views/ReviewView.vue'),
        meta: { requiresAuth: true, requiresCompleted: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    const test = useTestStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'login' }
    }

    if (to.meta.requiresInProgress && test.status !== 'in_progress') {
        return { name: 'home' }
    }

    if (to.meta.requiresCompleted && test.status !== 'completed') {
        return { name: 'home' }
    }

    if (to.meta.requiresGuest && auth.isAuthenticated) {
        return { name: 'home' }
    }
})

export default router