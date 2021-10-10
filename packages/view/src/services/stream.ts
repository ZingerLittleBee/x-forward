import { request } from 'umi'
import type { API } from '@/services/ant-design-pro/typings'

export async function getAllStream() {
    return request<{ data: API.StreamItem[] }>('/api/stream', { method: 'GET' })
}
