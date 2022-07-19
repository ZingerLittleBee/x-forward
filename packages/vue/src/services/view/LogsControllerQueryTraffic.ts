// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /logs/traffic/${param0} */
export async function LogsControllerQueryTraffic(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.LogsControllerQueryTrafficParams,
    options?: { [key: string]: any }
) {
    const { userId: param0, ...queryParams } = params
    return request<number>(`/logs/traffic/${param0}`, {
        method: 'GET',
        params: {
            ...queryParams
        },
        ...(options || {})
    })
}
