import axios from 'axios'

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
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance
