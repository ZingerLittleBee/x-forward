import { AutoMap } from '@automapper/classes'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { StateEnum } from 'src/enums/StatusEnum'

export class StreamVo {
    @AutoMap()
    readonly id: string

    @AutoMap()
    readonly state: StateEnum

    @AutoMap()
    readonly transitHost: string

    @AutoMap()
    readonly transitPort: number

    @AutoMap()
    readonly remoteHost: string

    @AutoMap()
    readonly remotePort: number

    @AutoMap()
    readonly status: number

    @AutoMap()
    readonly loadBalancing?: number

    @AutoMap()
    readonly protocol?: ProtocolEnum

    @AutoMap()
    readonly retries?: RetriesEnum

    @AutoMap()
    readonly retriesTimeout?: string

    @AutoMap()
    readonly connectTimeout?: string

    @AutoMap()
    readonly uploadRate?: string

    @AutoMap()
    readonly downloadRate?: string

    @AutoMap()
    readonly proxyTimeout?: string

    @AutoMap()
    readonly commment?: string

    @AutoMap()
    readonly upstreamId?: string
}
