import { StatusEnum } from '../../enums/StatusEnum'

export class Overview {
    os?: string

    nginxPath?: string

    nginxUptime?: string

    nginxStatus?: StatusEnum | string
}
