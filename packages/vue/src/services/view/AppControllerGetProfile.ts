// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /profile */
export async function AppControllerGetProfile(options?: { [key: string]: any }) {
    return request<any>('/profile', {
        method: 'GET',
        ...(options || {})
    })
}
