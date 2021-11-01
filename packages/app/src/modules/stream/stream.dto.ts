import { AutoMap } from '@automapper/classes'
import { IsNumberString, IsString } from 'class-validator'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { StateEnum } from 'src/enums/StatusEnum'

export class StreamDto {
    @AutoMap()
    readonly id?: string

    @AutoMap()
    @IsString()
    readonly transitHost: string

    @AutoMap()
    @IsNumberString()
    readonly state: StateEnum

    @AutoMap()
    @IsNumberString()
    readonly transitPort: number

    @AutoMap()
    @IsString()
    readonly remoteHost: string

    @AutoMap()
    @IsNumberString()
    readonly remotePort: number

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
    @IsNumberString()
    readonly loadBalancing?: number

    @AutoMap()
    @IsString()
    readonly commment?: string
}
