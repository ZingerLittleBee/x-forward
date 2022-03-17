import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { ProtocolEnum, RetriesEnum, StateEnum } from '@x-forward/common'
import { StreamEntity } from '../entity/stream.entity'
export class CreateStreamDto extends PickType(StreamEntity, [
    'clientId',
    'state',
    'transitHost',
    'transitPort',
    'remoteHost',
    'remotePort',
    'status',
    'protocol',
    'isRetries',
    'tries',
    'retriesTimeout',
    'connectTimeout',
    'uploadRate',
    'downloadRate',
    'proxyTimeout',
    'comment',
    'upstreamId'
]) {
    @AutoMap()
    clientId: string

    @AutoMap()
    state?: StateEnum

    @AutoMap()
    transitHost?: string

    @AutoMap()
    transitPort?: number

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
    tries?: number

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
