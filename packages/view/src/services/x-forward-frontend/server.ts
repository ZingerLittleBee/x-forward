// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 DELETE /server/${param0} */
export async function ServerControllerRemove(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.ServerControllerRemoveParams & {
        // path
        id: string
    },
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/server/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /server/${param0} */
export async function ServerControllerPatch(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.ServerControllerPatchParams & {
        // path
        id: string
    },
    body: API.UpdateServerDto,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/server/${param0}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}
