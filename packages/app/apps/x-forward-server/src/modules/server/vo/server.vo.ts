import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { ServerEntity } from '../entity/server.entity'

export class ServerVo extends PickType(ServerEntity, [
    'id',
    'upstreamHost',
    'upstreamPort',
    'weight',
    'maxCons',
    'maxFails',
    'failTimeout',
    'backup',
    'down'
]) {
    @AutoMap()
    id: string

    @AutoMap()
    upstreamHost: string

    @AutoMap()
    upstreamPort: number

    @AutoMap()
    weight?: number

    @AutoMap()
    maxCons?: number

    @AutoMap()
    maxFails?: number

    @AutoMap()
    failTimeout?: string

    @AutoMap()
    backup?: 0 | 1

    @AutoMap()
    down?: 0 | 1
}
