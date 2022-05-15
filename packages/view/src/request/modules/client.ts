import { request } from '../index'

export const getAllClient = () =>
    request('/client', {
        method: 'GET'
    })

export const getClientById = (id: string) => request(`/client/id/${id}`, { method: 'GET' })

export const getClientByIp = (ip: string) =>
    request(`/client/ip/${ip}`, {
        method: 'GET'
    })
