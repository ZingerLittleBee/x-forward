import Footer from '@/components/Footer'
import RightContent from '@/components/RightContent'
import LsConstant from '@/constants/localstorage.constant'
import type { RequestConfig } from '@@/plugin-request/request'
import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { PageLoading } from '@ant-design/pro-layout'
import { history, RunTimeLayoutConfig } from 'umi'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RequestOptionsInit } from 'umi-request'
import { ClientControllerGetAll } from './services/view/client'
import { computeIfPresent } from './utils/localstorage.util'

const loginPath = '/user/login'

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />
}

export interface InitialState {
    curClientId?: string
    settings?: Partial<LayoutSettings>
    clients?: API.ClientVo[]
}

let clients: API.ClientVo[] | undefined

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
    const fetchAllClient = async () => {
        const clientController = new AbortController()
        try {
            return (await ClientControllerGetAll({ signal: clientController.signal }))?.data
        } catch (error) {
            clientController.abort()
        }
        return undefined
    }
    // 如果是登录页面，不执行
    if (history.location.pathname !== loginPath) {
        if (!clients) {
            clients = await fetchAllClient()
        }
        const firstClientId = clients?.[0].id
        let curClientId = computeIfPresent(LsConstant.CurClientId, firstClientId)
        if (curClientId !== firstClientId) {
            if (clients && clients.findIndex(c => c?.id === curClientId) < 0) {
                curClientId = firstClientId
            }
        }
        if (curClientId) {
            return {
                clients,
                settings: {},
                curClientId
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
        options: {
            ...options,
            interceptors: true
            // errorHandler: (err: ResponseError) => {
            //     throw err
            // }
        }
    }
}

export const request: RequestConfig = {
    timeout: 3000,
    errorConfig: {},
    middlewares: [],
    requestInterceptors: [apiInterceptor],
    responseInterceptors: []
}
