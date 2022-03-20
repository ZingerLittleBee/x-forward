import { StatusEnum } from '@x-forward/common'
export interface Overview {
    os?: string

    nginxPath?: string

    nginxUptime?: string

    nginxStatus?: StatusEnum | string

    systemTime?: string
}
