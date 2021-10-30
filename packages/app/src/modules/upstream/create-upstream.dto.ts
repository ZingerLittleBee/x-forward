import { AutoMap } from '@automapper/classes'
import { NginxLoadBalancingEnum } from '../../enums/NginxEnum'
import { CreateServerDto } from './server/dto/create-server.dto'

export class CreateUpstreamDto {
    @AutoMap()
    name: string

    @AutoMap()
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => CreateServerDto })
    server: CreateServerDto[]
}
