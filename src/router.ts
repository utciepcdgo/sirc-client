import {createMemoryHistory, createRouter} from 'vue-router'

import Registrations from "@/components/Registrations.vue";
import Home from "@/components/Home.vue";

const routes = [
    {path: '/', redirect: '/registrations'},
    {path: '/registrations', component: Registrations},
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router