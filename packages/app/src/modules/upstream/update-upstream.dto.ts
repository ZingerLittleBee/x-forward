import { AutoMap } from '@automapper/classes'
import { PartialType } from '@nestjs/swagger'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { CreateUpstreamDto } from './create-upstream.dto'
import { UpdateServerDto } from './server/dto/update-server.dto'

export class UpdateUpstreamDto extends PartialType(CreateUpstreamDto) {
    @AutoMap()
    name?: string

    @AutoMap()
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => UpdateServerDto })
    server: UpdateServerDto[]
}
