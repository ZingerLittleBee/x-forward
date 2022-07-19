import { request } from '../index'
import { CreateUserDto } from '@x-forward/app/apps/x-forward-server/src/modules/user/user.dto'

const USER_BASE = '/user'

export const getAllUser = () =>
    request(USER_BASE, {
        method: 'GET'
    })

export const createUser = (user: CreateUserDto) =>
    request(USER_BASE, {
        method: 'POST',
        data: user
    })

export const deleteUser = (id: string) =>
    request(`${USER_BASE}${id}`, {
        method: 'DELETE'
    })
