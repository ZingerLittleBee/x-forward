// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /gateway/relation/${param0} */
export async function ServerGatewayController_GetPortAndUserRelation(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.ServerGatewayController_GetPortAndUserRelationParams,
    options?: { [key: string]: any }
) {
    const { clientId: param0, ...queryParams } = params
    return request<any>(`/gateway/relation/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}
