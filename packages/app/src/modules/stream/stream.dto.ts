import { AutoMap } from '@automapper/classes'
import { IsNumberString, IsString } from 'class-validator'
import { StateEnum } from 'src/enums/StatusEnum'

export class StreamDto {
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
    @IsNumberString()
    readonly loadBalancing: number

    @AutoMap()
    @IsString()
    readonly commment?: string
}
