import { AutoMap } from '@automapper/classes'
import { LoadBalancingEnum, StateEnum, StatusEnum } from '@forwardx/shared'
import { PickType } from '@nestjs/swagger'
import { ProtocolEnum, RetriesEnum } from '@x-forward/common'
import { StreamEntity } from '../entity/stream.entity'

export class StreamVo extends PickType(StreamEntity, [
    'id',
    'state',
    'userId',
    'clientId',
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
    'upstreamId',
    'createTime'
]) {
    @AutoMap()
    id: string
    @AutoMap()
    state: StateEnum
    @AutoMap()
    userId?: string
    @AutoMap()
    clientId?: string
    @AutoMap()
    transitHost?: string
    @AutoMap()
    transitPort?: number
    @AutoMap()
    remoteHost?: string
    @AutoMap()
    remotePort?: number
    @AutoMap()
    status?: StatusEnum
    @AutoMap()
    loadBalancing?: LoadBalancingEnum
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
    @AutoMap()
    createTime?: Date
}
