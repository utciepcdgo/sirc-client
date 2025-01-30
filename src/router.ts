import {createMemoryHistory, createRouter} from 'vue-router'
import { useAuthStore } from "@/stores/auth";

import Registrations from "@/components/Registrations.vue";
import Login from "@/components/Login.vue";

const routes = [
    { path: "/login", component: Login },
    {path: '/', redirect: '/registrations'},
    {path: '/registrations', component: Registrations, meta: {requiresAuth: true}},
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.token) {
        next("/login");
    } else {
        next();
    }
});

export default router