import { AutoMap } from '@automapper/classes'

export class ServerVo {
    @AutoMap()
    upstreamHost: string

    @AutoMap()
    upstreamPort: number

    @AutoMap()
    weight?: number

    @AutoMap()
    maxConns?: number

    @AutoMap()
    maxFails?: number

    @AutoMap()
    failTimeout?: string

    @AutoMap()
    backup?: 0 | 1

    @AutoMap()
    down?: 0 | 1
}
