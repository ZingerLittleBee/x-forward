import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
import IconDashboard from '~icons/carbon/dashboard-reference'
import IconModule from '~icons/mdi/view-dashboard-outline'
import IconStream from '~icons/carbon/flow-stream'
import IconUpstream from '~icons/ant-design/cloud-server-outlined'
import IconTerminal from '~icons/bi/terminal-plus'
import { FunctionalComponent, SVGAttributes, VNode } from 'vue'
import Module from '@/pages/module/index.vue'
import Stream from '@/pages/stream/index.vue'
import Upstream from '@/pages/upstream/index.vue'
import Terminal from '@/pages/terminal/index.vue'

declare module 'vue-router' {
    interface RouteMeta {
        icon?: FunctionalComponent<SVGAttributes> & { name?: string; render?: () => VNode }
        isAdmin?: boolean
        requiresAuth?: boolean
        hidden?: boolean
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Dashboard,
        name: '仪表盘',
        meta: {
            icon: IconDashboard
        }
    },
    {
        path: '/module',
        component: Module,
        name: '模块',
        meta: {
            icon: IconModule
        }
    },
    {
        path: '/stream',
        component: Stream,
        name: '转发',
        meta: {
            icon: IconStream
        }
    },
    {
        path: '/upstream',
        component: Upstream,
        name: '上游',
        meta: {
            icon: IconUpstream
        }
    },
    {
        path: '/terminal',
        component: Terminal,
        name: '终端',
        meta: {
            icon: IconTerminal
        }
    },
    {
        path: '/404',
        component: () => import('@/pages/error-page/404.vue'),
        meta: {
            hidden: true
        }
    },
    { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
