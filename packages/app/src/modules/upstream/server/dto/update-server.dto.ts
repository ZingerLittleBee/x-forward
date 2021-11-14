import { PartialType } from '@nestjs/swagger'
import { CreateServerDto } from './create-server.dto'

export class UpdateServerDto extends PartialType(CreateServerDto) {
    // @AutoMap()
    // id: string
    // @AutoMap()
    // upstreamHost: string
    // @AutoMap()
    // upstreamPort: number
    // @AutoMap()
    // weight?: number
    // @AutoMap()
    // maxConns?: number
    // @AutoMap()
    // maxFails?: number
    // @AutoMap()
    // failTimeout?: string
    // @AutoMap()
    // backup?: 0 | 1
    // @AutoMap()
    // down?: 0 | 1
}
