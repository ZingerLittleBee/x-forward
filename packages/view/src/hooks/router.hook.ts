import { useRouter } from 'vue-router'
import { h, VNode } from 'vue'

export type SingleRoute = {
    path: string
    name: string | symbol
    icon?: VNode
}

export const getRouterInfo = (): SingleRoute[] => {
    const routes = useRouter().options.routes
    return routes.map(r => {
        const singleRoute: SingleRoute = {
            path: r.path,
            name: r.name ? r.name : r.path
        }
        r.meta?.icon && (singleRoute['icon'] = h(r.meta?.icon))
        return singleRoute
    })
}
