import { StatusEnum } from '@forwardx/shared'
export interface Overview {
    os?: string

    nginxPath?: string

    nginxUptime?: string

    nginxStatus?: StatusEnum | string

    systemTime?: string
}
