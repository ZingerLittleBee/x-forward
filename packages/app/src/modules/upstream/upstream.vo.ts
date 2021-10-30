import { AutoMap } from '@automapper/classes'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { Entity } from 'typeorm'
import { ServerVo } from './server/server.vo'

@Entity('upstream')
export class UpstreamVo {
    @AutoMap()
    id: string

    @AutoMap()
    name: string

    @AutoMap()
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => ServerVo })
    server: ServerVo[]
}
