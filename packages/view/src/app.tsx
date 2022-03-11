import Footer from '@/components/Footer'
import RightContent from '@/components/RightContent'
import { EnvControllerGetNginxConfig, EnvControllerGetOverview } from '@/services/view/env'
import type { RequestConfig } from '@@/plugin-request/request'
import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { PageLoading } from '@ant-design/pro-layout'
import { message } from 'antd'
import { io, Socket } from 'socket.io-client'
import type { RunTimeLayoutConfig } from 'umi'
import { history } from 'umi'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RequestOptionsInit } from 'umi-request'
import { ClientControllerGetAll } from './services/view/client'

const loginPath = '/user/login'

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>
    clients?: API.ClientVo[]
    overview?: API.OverviewVo
    nginxConfig?: API.NginxConfigVo
    socket?: Socket
}> {
    const fetchAllClient = async () => {
        try {
            return (await ClientControllerGetAll())?.data
        } catch (error) {
            message.warning('获取系统信息失败')
        }
        return undefined
    }
    const fetchOverview = async (clientId: string) => {
        try {
            return (await EnvControllerGetOverview({ clientId })).data
        } catch (error) {
            message.warning('获取系统信息失败')
        }
        return undefined
    }
    const fetchNginxConfig = async (clientId: string) => {
        try {
            return (await EnvControllerGetNginxConfig({ clientId })).data
        } catch (error) {
            message.warning('获取 nginx 参数失败')
        }
        return undefined
    }
    const createSocket = (url: string) => {
        const socket = io(url)
        socket.on('connect', () => {
            console.log('ws connected success')
        })
        socket.on('connect_error', err => {
            console.log('ws occurred error: ', err)
        })
        socket.on('disconnect', reason => {
            console.log('ws disconnected: ', reason)
        })
        return socket
    }
    // 如果是登录页面，不执行
    if (history.location.pathname !== loginPath) {
        const clients = await fetchAllClient()
        const defaultClientId = clients?.[0]?.id
        if (defaultClientId) {
            const overview = await fetchOverview(defaultClientId)
            const socket = createSocket('localhost:1234')
            const nginxConfig = await fetchNginxConfig(defaultClientId)
            return {
                clients,
                overview,
                nginxConfig,
                settings: {},
                socket
            }
        }
    }
    return {
        settings: {}
    }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,
        // waterMarkProps: {
        //   content: initialState?.currentUser?.name,
        // },
        footerRender: () => <Footer />,
        onPageChange: () => {
            // TODO
            // const { location } = history
            // // 如果没有登录，重定向到 login
            // if (!initialState?.currentUser && location.pathname !== loginPath) {
            //     history.push(loginPath)
            // }
        },
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        ...initialState?.settings
    }
}

const apiInterceptor = (url: string, options: RequestOptionsInit) => {
    return {
        url: `/api${url}`,
        options: { ...options, interceptors: true }
    }
}

export const request: RequestConfig = {
    timeout: 5000,
    errorConfig: {},
    middlewares: [],
    requestInterceptors: [apiInterceptor],
    responseInterceptors: []
}
