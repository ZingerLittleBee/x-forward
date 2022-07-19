import Client from '@/pages/client/index.vue'
import Dashboard from '@/pages/dashboard/index.vue'
import Module from '@/pages/module/index.vue'
import Stream from '@/pages/stream/index.vue'
import Terminal from '@/pages/terminal/index.vue'
import Upstream from '@/pages/upstream'
import { FunctionalComponent, SVGAttributes, VNode } from 'vue'
import 'vue-router'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import IconUpstream from '~icons/ant-design/cloud-server-outlined'
import IconTerminal from '~icons/bi/terminal-plus'
import IconDashboard from '~icons/carbon/dashboard-reference'
import IconStream from '~icons/carbon/flow-stream'
import IconClient from '~icons/clarity/rack-server-outline-badged'
import IconModule from '~icons/mdi/view-dashboard-outline'

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
        path: '/client',
        component: Client,
        name: '客户端',
        meta: {
            icon: IconClient
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
