// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /stream */
export async function StreamControllerGetStream(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerGetStreamParams,
    options?: { [key: string]: any }
) {
    return request<{ success?: boolean; data?: API.StreamVo[] }>('/stream', {
        method: 'GET',
        params: {
            ...params
        },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /stream */
export async function StreamControllerCreateOne(body: API.CreateStreamDto, options?: { [key: string]: any }) {
    return request<{ success?: boolean; message?: string; data?: API.StreamVo }>('/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 DELETE /stream */
export async function StreamControllerDeleteAllStream(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerDeleteAllStreamParams,
    options?: { [key: string]: any }
) {
    return request<any>('/stream', {
        method: 'DELETE',
        params: {
            ...params
        },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /stream */
export async function StreamControllerUpdateStream(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerUpdateStreamParams,
    body: API.StreamDto,
    options?: { [key: string]: any }
) {
    return request<any>('/stream', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            ...params
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 DELETE /stream/${param0} */
export async function StreamControllerDelete(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerDeleteParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/stream/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /stream/${param0}/state */
export async function StreamControllerUpdateStateById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerUpdateStateByIdParams,
    body: { state?: number },
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string }>(`/stream/${param0}/state`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /stream/${param0}/upstream_id */
export async function StreamControllerUpdateUpstreamIdById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerUpdateUpstreamIdByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/stream/${param0}/upstream_id`, {
        method: 'PATCH',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /stream/restart */
export async function StreamControllerRestart(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerRestartParams,
    options?: { [key: string]: any }
) {
    return request<any>('/stream/restart', {
        method: 'POST',
        params: {
            ...params
        },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /stream/state */
export async function StreamControllerUpdateAllState(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.StreamControllerUpdateAllStateParams,
    options?: { [key: string]: any }
) {
    return request<any>('/stream/state', {
        method: 'PATCH',
        params: {
            ...params
        },
        ...(options || {})
    })
}
