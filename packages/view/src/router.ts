import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
import IconAccessibility from '~icons/carbon/accessibility'
import { FunctionalComponent, h, SVGAttributes, VNode } from 'vue'

declare module 'vue-router' {
    interface RouteMeta {
        icon?: FunctionalComponent<SVGAttributes> & { name?: string; render?: () => VNode }
        isAdmin?: boolean
        requiresAuth?: boolean
    }
}

const Stream = { template: '<div>Stream</div>' }
const About = { template: '<div>About</div>' }

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Dashboard,
        name: '仪表盘',
        meta: {
            icon: IconAccessibility
        }
    },
    { path: '/stream', component: Stream, name: 'Stream' },
    { path: '/about', component: About, name: '关于' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
