import { StatusEnum } from '@app/x-forward-common'

export class Overview {
    os?: string

    nginxPath?: string

    nginxUptime?: string

    nginxStatus?: StatusEnum | string
}
