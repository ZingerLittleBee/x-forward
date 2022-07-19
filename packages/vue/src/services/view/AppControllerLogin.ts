// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 POST /auth/login */
export async function AppControllerLogin(options?: { [key: string]: any }) {
    return request<any>('/auth/login', {
        method: 'POST',
        ...(options || {})
    })
}
