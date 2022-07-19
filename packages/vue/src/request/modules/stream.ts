import { request } from '../index'
import { CreateStreamDto } from '@x-forward/app/apps/x-forward-server/src/modules/stream/dto/create-stream.dto'
import { StreamVo } from '@x-forward/app/apps/x-forward-server/src/modules/stream/vo/stream.vo'
import { UpdateStreamDto } from '@x-forward/app/apps/x-forward-server/src/modules/stream/dto/update-stream.dto'
import { StateEnum } from '@forwardx/shared'

export const getAllStreamByCid = (clientId: string) =>
    request('/stream', {
        method: 'GET',
        params: {
            clientId: clientId
        }
    })

export const createStream = (stream: CreateStreamDto) =>
    request<StreamVo>('/stream', {
        method: 'POST',
        data: stream
    })

export const updateStream = (id: string, stream: UpdateStreamDto) =>
    request('/stream', {
        method: 'PATCH',
        params: {
            id
        },
        data: stream
    })

export const ruleRestart = (clientId?: string) =>
    request('/stream/restart', {
        method: 'POST',
        params: {
            clientId
        }
    })

export const toggleRuleState = (id: string, data: { state: StateEnum }) =>
    request(`/stream/${id}/state`, {
        method: 'POST',
        data
    })

export const changeUpstream = (id: string) =>
    request(`stream/${id}/upstream_id`, {
        method: 'PATCH'
    })

export const toggleAllRuleState = (state: StateEnum, clientId?: string) =>
    request('/stream/state', {
        method: 'PATCH',
        params: {
            state,
            clientId
        }
    })

export const deleteStreamById = (id?: string) =>
    request(`/stream/${id}`, {
        method: 'DELETE'
    })

export const deleteStreamByCid = (clientId?: string) =>
    request('/stream', {
        method: 'DELETE',
        params: {
            clientId
        }
    })
