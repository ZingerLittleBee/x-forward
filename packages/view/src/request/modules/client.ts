import { request } from '../index'
import { ClientVo } from '@x-forward/app/apps/x-forward-server/src/modules/client/vo/client.vo'

export const getAllClient = () =>
    request<ClientVo[]>('/client', {
        method: 'GET'
    })

export const getClientById = (id: string) => request(`/client/id/${id}`, { method: 'GET' })

export const getClientByIp = (ip: string) =>
    request(`/client/ip/${ip}`, {
        method: 'GET'
    })
