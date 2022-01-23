import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { LoadBalancingEnum } from '@x-forward/shared'
import { UpdateStreamDto } from '../../stream/dto/update-stream.dto'
import { UpdateServerDto } from '../../server/dto/update-server.dto'
import { UpstreamEntity } from '../entity/upstream.entity'

export class UpdateUpstreamDto extends PickType(UpstreamEntity, ['name', 'loadBalancing']) {
    @AutoMap()
    name: string
    @AutoMap()
    loadBalancing?: LoadBalancingEnum
    @AutoMap({ typeFn: () => UpdateStreamDto })
    stream?: UpdateStreamDto[]
    @AutoMap({ typeFn: () => UpdateServerDto })
    server: UpdateServerDto[]
}
