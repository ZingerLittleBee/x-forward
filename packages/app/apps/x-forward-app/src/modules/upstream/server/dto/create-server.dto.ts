import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { ServerEntity } from '../entities/server.entity'

// export class CreateServerDto extends PickType(ServerEntity, [
//     'upstreamHost',
//     'upstreamPort',
//     'weight',
//     'maxConns',
//     'maxFails',
//     'failTimeout',
//     'backup',
//     'down'
// ]) {
//     // @AutoMap()
//     // upstreamHost: string
//     // @AutoMap()
//     // upstreamPort: number
//     // @AutoMap()
//     // weight?: number
//     // @AutoMap()
//     // maxConns?: number
//     // @AutoMap()
//     // maxFails?: number
//     // @AutoMap()
//     // failTimeout?: string
//     // @AutoMap()
//     // backup?: 0 | 1
//     // @AutoMap()
//     // down?: 0 | 1
// }

export class CreateServerDto extends PickType(ServerEntity, [
    'upstreamHost',
    'upstreamPort',
    'weight',
    'maxConns',
    'maxFails',
    'failTimeout',
    'backup',
    'down'
]) {
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
