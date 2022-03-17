import { PickType } from '@nestjs/swagger'
import { StreamEntity } from '../entity/stream.entity'

export class StreamDto extends PickType(StreamEntity, [
    'id',
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
    // @AutoMap()
    // readonly id?: string
    // @AutoMap()
    // @IsString()
    // readonly transitHost: string
    // @AutoMap()
    // @IsNumberString()
    // readonly state: StateEnum
    // @AutoMap()
    // @IsNumberString()
    // readonly transitPort: number
    // @AutoMap()
    // @IsString()
    // readonly remoteHost: string
    // @AutoMap()
    // @IsNumberString()
    // readonly remotePort: number
    // @AutoMap()
    // protocol?: ProtocolEnum
    // @AutoMap()
    // isRetries?: RetriesEnum
    // @AutoMap()
    // tries: number
    // @AutoMap()
    // retriesTimeout?: string
    // @AutoMap()
    // connectTimeout?: string
    // @AutoMap()
    // uploadRate?: string
    // @AutoMap()
    // downloadRate?: string
    // @AutoMap()
    // proxyTimeout?: string
    // @AutoMap()
    // @IsNumberString()
    // readonly loadBalancing?: number
    // @AutoMap()
    // @IsString()
    // readonly commment?: string
}
