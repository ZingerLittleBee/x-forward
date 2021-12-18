import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { UpdateStreamDto } from '../stream/update-stream.dto'
import { UpdateServerDto } from './server/dto/update-server.dto'
import { UpstreamEntity } from './upstream.entity'

export class UpdateUpstreamDto extends PickType(UpstreamEntity, ['name', 'loadBalancing']) {
    @AutoMap()
    name: string
    @AutoMap()
    loadBalancing?: NginxLoadBalancingEnum
    @AutoMap({ typeFn: () => UpdateStreamDto })
    stream?: UpdateStreamDto[]
    @AutoMap({ typeFn: () => UpdateServerDto })
    server: UpdateServerDto[]
}
