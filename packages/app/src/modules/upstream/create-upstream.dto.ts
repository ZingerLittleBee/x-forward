import { AutoMap } from '@automapper/classes'
import { NginxLoadBalancingEnum } from '../../enums/NginxEnum'
import { CreateStreamDto } from '../stream/create-stream.dto'
import { CreateServerDto } from './server/dto/create-server.dto'

export class CreateUpstreamDto {
    @AutoMap()
    name: string

    @AutoMap()
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => CreateStreamDto })
    stream: CreateStreamDto[]

    @AutoMap({ typeFn: () => CreateServerDto })
    server: CreateServerDto[]
}
