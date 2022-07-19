// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 POST /gateway/register */
export async function ServerGatewayController_Register(body: API.CreateClientDto, options?: { [key: string]: any }) {
    return request<any>('/gateway/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
