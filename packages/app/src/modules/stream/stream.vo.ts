import { AutoMap } from '@automapper/classes'
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
    readonly commment?: string
}
