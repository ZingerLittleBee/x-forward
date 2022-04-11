import { AutoMap } from '@automapper/classes'
import { LoadBalancingEnum } from '@forwardx/shared'
import { PartialType } from '@nestjs/swagger'
import { UpdateServerDto } from '../../server/dto/update-server.dto'
import { UpdateStreamDto } from '../../stream/dto/update-stream.dto'
import { UpstreamEntity } from '../entity/upstream.entity'

export class UpdateUpstreamDto extends PartialType(UpstreamEntity) {
    @AutoMap()
    id?: string

    @AutoMap()
    name?: string

    @AutoMap()
    loadBalancing?: LoadBalancingEnum

    @AutoMap({ typeFn: () => UpdateStreamDto })
    stream?: UpdateStreamDto[]

    @AutoMap({ typeFn: () => UpdateServerDto })
    server: UpdateServerDto[]
}
