import { useAxios } from '@vueuse/integrations/useAxios'
import instance from './instance'
import { AxiosRequestConfig } from 'axios'

export const request = <T>(url: string, config?: AxiosRequestConfig, immediate = true) =>
    useAxios<T>(url, config ? { ...config } : {}, instance, {
        immediate
    })

export * from './modules/user'
export * from './modules/stream'
export * from './modules/upstream'
export * from './modules/client'
