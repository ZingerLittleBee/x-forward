import { PickType } from '@nestjs/swagger'
import { StreamEntity } from './stream.entity'

export class StreamVo extends PickType(StreamEntity, [
    'id',
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
    'upstreamId',
    'createTime',
    'updateTime'
]) {
    // @AutoMap()
    // readonly id: string
    // @AutoMap()
    // readonly state: StateEnum
    // @AutoMap()
    // readonly transitHost: string
    // @AutoMap()
    // readonly transitPort: number
    // @AutoMap()
    // readonly remoteHost: string
    // @AutoMap()
    // readonly remotePort: number
    // @AutoMap()
    // readonly status: number
    // @AutoMap()
    // readonly loadBalancing?: number
    // @AutoMap()
    // readonly protocol?: ProtocolEnum
    // @AutoMap()
    // readonly retries?: RetriesEnum
    // @AutoMap()
    // readonly retriesTimeout?: string
    // @AutoMap()
    // readonly connectTimeout?: string
    // @AutoMap()
    // readonly uploadRate?: string
    // @AutoMap()
    // readonly downloadRate?: string
    // @AutoMap()
    // readonly proxyTimeout?: string
    // @AutoMap()
    // readonly commment?: string
    // @AutoMap()
    // readonly upstreamId?: string
}
