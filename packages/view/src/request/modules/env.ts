import { request } from '../index'

const ENV_BASE = '/env'

export const getNginxInfo = (clientId: string) =>
    request(`${ENV_BASE}/${clientId}/nginx`, {
        method: 'GET'
    })

export const getOverview = (clientId: string) =>
    request(`${ENV_BASE}/${clientId}/overview`, {
        method: 'GET'
    })

export const getOs = (clientId: string) =>
    request(`${ENV_BASE}/${clientId}/os`, {
        method: 'GET'
    })

export const getPath = (clientId: string, url: string) =>
    request<string[]>(`${ENV_BASE}/${clientId}/path`, {
        method: 'GET',
        params: {
            url
        }
    })
