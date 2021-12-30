import { ProtocolEnum, RetriesEnum, StateEnum } from '@app/x-forward-common'
import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { Entity } from 'typeorm'
import { StreamEntity } from './stream.entity'

@Entity('stream')
export class CreateStreamDto extends PickType(StreamEntity, [
    'state',
    'transitHost',
    'transitPort',
    'remoteHost',
    'remotePort',
    'status',
    'loadBalancing',
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
