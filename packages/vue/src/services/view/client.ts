// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /client */
export async function ClientControllerGetAll(options?: { [key: string]: any }) {
    return request<{ success?: boolean; data?: API.ClientVo[] }>('/client', {
        method: 'GET',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /client/id/${param0} */
export async function ClientControllerGetById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.ClientControllerGetByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.ClientVo }>(`/client/id/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /client/ip/${param0} */
export async function ClientControllerGetByIp(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.ClientControllerGetByIpParams,
    options?: { [key: string]: any }
) {
    const { ip: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.ClientVo }>(`/client/ip/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}
