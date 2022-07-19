import { CreateUpstreamDto } from '@x-forward/app/apps/x-forward-server/src/modules/upstream/dto/create-upstream.dto'
import { UpdateUpstreamDto } from '@x-forward/app/apps/x-forward-server/src/modules/upstream/dto/update-upstream.dto'
import { UpstreamVo } from '@x-forward/app/apps/x-forward-server/src/modules/upstream/vo/upstream.vo'
import { request } from '../index'

const UPSTREAM_BASE = '/upstream'

export const getUpstreamById = (id: string) =>
    request(`${UPSTREAM_BASE}/${id}`, {
        method: 'GET'
    })

export const getAllUpstream = () =>
    request<UpstreamVo[]>(UPSTREAM_BASE, {
        method: 'GET'
    })

export const createUpstream = (upstream: CreateUpstreamDto) =>
    request(UPSTREAM_BASE, {
        method: 'GET',
        data: upstream
    })

export const updateUpstream = (upstream: UpdateUpstreamDto) =>
    request<UpstreamVo>(UPSTREAM_BASE, {
        method: 'PATCH',
        data: upstream
    })

export const deleteUpstreamById = (id: string) =>
    request(`${UPSTREAM_BASE}/${id}`, {
        method: 'DELETE'
    })
