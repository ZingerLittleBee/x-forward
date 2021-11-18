import { StatusEnum } from 'src/enums/StatusEnum'

export class Overview {
    os?: string

    nginxPath?: string

    nginxUptime?: string

    nginxStatus?: StatusEnum | string
}
