// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /env/${param0}/nginx */
export async function EnvControllerGetNginxConfig(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.EnvControllerGetNginxConfigParams,
    options?: { [key: string]: any }
) {
    const { clientId: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.NginxConfigVo }>(`/env/${param0}/nginx`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /env/${param0}/os */
export async function EnvControllerGetSystemInfo(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.EnvControllerGetSystemInfoParams,
    options?: { [key: string]: any }
) {
    const { clientId: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.SystemInfoVo }>(`/env/${param0}/os`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /env/${param0}/overview */
export async function EnvControllerGetOverview(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.EnvControllerGetOverviewParams,
    options?: { [key: string]: any }
) {
    const { clientId: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: API.OverviewVo }>(`/env/${param0}/overview`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /env/${param0}/path */
export async function EnvControllerGetDirectory(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.EnvControllerGetDirectoryParams,
    options?: { [key: string]: any }
) {
    const { clientId: param0, ...queryParams } = params
    return request<{ success?: boolean; data?: string[] }>(`/env/${param0}/path`, {
        method: 'GET',
        params: {
            ...queryParams
        },
        ...(options || {})
    })
}
