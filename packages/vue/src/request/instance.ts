import axios from 'axios'
import { app } from '@/main'

const instance = axios.create({
    baseURL: '/api',
    timeout: 3000
})

instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        const respData = response.data
        if (respData?.success) {
            return respData
        }
        app.config.globalProperties.$alert?.({
            message: respData.message,
            type: 'warning'
        })
        return Promise.reject()
    },
    error => {
        app.config.globalProperties.$alert?.({
            message: error.message,
            type: 'error'
        })
        return Promise.reject(error)
    }
)

export default instance
