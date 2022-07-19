// @ts-ignore
/* eslint-disable */
import { request } from 'umi'

/** 此处后端没有提供注释 GET /user */
export async function UserControllerGetAll(options?: { [key: string]: any }) {
    return request<{ success?: boolean; data?: API.UserVo[] }>('/user', {
        method: 'GET',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /user */
export async function UserControllerCreateUser(body: API.CreateUserDto, options?: { [key: string]: any }) {
    return request<{ success?: boolean; message?: string; data?: API.UserEntity }>('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 DELETE /user/${param0} */
export async function UserControllerDelete(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UserControllerDeleteParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<{ success?: boolean; message?: string; data?: number }>(`/user/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /user/login */
export async function UserControllerLogin(body: API.LoginUserDto, options?: { [key: string]: any }) {
    return request<{ success?: boolean; message?: string }>('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
