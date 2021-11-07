import { AutoMap } from '@automapper/classes'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { StateEnum } from 'src/enums/StatusEnum'
import { Entity } from 'typeorm'

@Entity('stream')
export class CreateStreamDto {
    @AutoMap()
    state: StateEnum

    @AutoMap()
    transitHost: string

    @AutoMap()
    transitPort: number

    @AutoMap()
    remoteHost?: string

    @AutoMap()
    remotePort?: number

    @AutoMap()
    status?: number

    @AutoMap()
    loadBalancing?: number

    @AutoMap()
    protocol?: ProtocolEnum

    @AutoMap()
    isRetries?: RetriesEnum

    @AutoMap()
    tries: number

    @AutoMap()
    retriesTimeout?: string

    @AutoMap()
    connectTimeout?: string

    @AutoMap()
    uploadRate?: string

    @AutoMap()
    downloadRate?: string

    @AutoMap()
    proxyTimeout?: string

    @AutoMap()
    comment?: string

    @AutoMap()
    upstreamId?: string
}
