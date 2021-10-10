import { request } from 'umi'
import type { API } from '@/services/ant-design-pro/typings'

export async function getEnv() {
    return request<{ data: API.Env }>('/env/nginx', { method: 'GET' })
}

export async function getPath(path: string) {
    return request<{ data: API.Path[] }>(`/env/path/${path}`, { method: 'GET' })
}
