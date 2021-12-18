// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /upstream */
export async function UpstreamControllerFindAll(options?: { [key: string]: any }) {
    return request<{ success?: boolean; data?: API.UpstreamVo[] }>('/upstream', {
        method: 'GET',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /upstream */
export async function UpstreamControllerCreate(body: API.CreateUpstreamDto, options?: { [key: string]: any }) {
    return request<{ success?: boolean; message?: string; data?: API.UpstreamEntity }>('/upstream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /upstream/${param0} */
export async function UpstreamControllerFindOne(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UpstreamControllerFindOneParams & {
        // path
        id: string
    },
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.UpstreamVo }>(`/upstream/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 DELETE /upstream/${param0} */
export async function UpstreamControllerRemove(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UpstreamControllerRemoveParams & {
        // path
        id: string
    },
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/upstream/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /upstream/${param0} */
export async function UpstreamControllerUpdate(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UpstreamControllerUpdateParams & {
        // path
        id: string
    },
    body: API.UpdateUpstreamDto,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/upstream/${param0}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}
