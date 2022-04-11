import { AutoMap } from '@automapper/classes'
import { StateEnum } from '@forwardx/shared'
import { PartialType } from '@nestjs/swagger'
import { ProtocolEnum, RetriesEnum } from '@x-forward/common'
import { StreamEntity } from '../entity/stream.entity'

export class StreamDto extends PartialType(StreamEntity) {
    @AutoMap()
    id?: string

    @AutoMap()
    transitHost: string

    @AutoMap()
    state: StateEnum

    @AutoMap()
    transitPort: number

    @AutoMap()
    remoteHost: string

    @AutoMap()
    remotePort: number

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
    commment?: string
}
