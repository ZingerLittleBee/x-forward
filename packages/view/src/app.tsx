import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { PageLoading } from '@ant-design/pro-layout'
import type { RunTimeLayoutConfig } from 'umi'
import { history, Link } from 'umi'
import RightContent from '@/components/RightContent'
import Footer from '@/components/Footer'
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api'
import { BookOutlined, LinkOutlined } from '@ant-design/icons'
import { getEnv, getPath } from '@/services/env'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client/build/socket'

const isDev = process.env.NODE_ENV === 'development'
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
    currentUser?: API.CurrentUser
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>
    currEnv?: API.Env
    nginxPath?: API.Path[]
    socket?: Socket
}> {
    const fetchEnv = async () => {
        try {
            const envRes = await getEnv()
            return envRes.data
        } catch (error) {
            history.push(loginPath)
        }
        return undefined
    }
    const fetchNginx = async (name: string) => {
        try {
            const envRes = await getPath(name)
            return envRes.data
        } catch (error) {
            history.push(loginPath)
        }
        return undefined
    }
    const fetchUserInfo = async () => {
        try {
            const msg = await queryCurrentUser()
            return msg.data
        } catch (error) {
            history.push(loginPath)
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
        const currentUser = await fetchUserInfo()
        const currEnv = await fetchEnv()
        const nginxPath = await fetchNginx('nginx')
        const socket = createSocket('localhost:1234')
        return {
            fetchUserInfo,
            currentUser,
            settings: {},
            currEnv,
            nginxPath,
            socket
        }
    }
    return {
        fetchUserInfo,
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
            const { location } = history
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath)
            }
        },
        links: isDev
            ? [
                  <Link to="/umi/plugin/openapi" target="_blank">
                      <LinkOutlined />
                      <span>OpenAPI 文档</span>
                  </Link>,
                  <Link to="/~docs">
                      <BookOutlined />
                      <span>业务组件文档</span>
                  </Link>
              ]
            : [],
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        ...initialState?.settings
    }
}
