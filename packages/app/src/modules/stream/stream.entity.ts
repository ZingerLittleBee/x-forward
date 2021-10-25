import { AutoMap } from '@automapper/classes'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { StatusEnum } from 'src/enums/StatusEnum'
import { Column, Entity } from 'typeorm'

@Entity()
export class Stream extends CommonEntity {
    @AutoMap()
    @Column({ name: 'transit_host' })
    transitHost: string

    @AutoMap()
    @Column({ name: 'transit_port' })
    transitPort: number

    @AutoMap()
    @Column({ name: 'remote_host' })
    remoteHost: string

    @AutoMap()
    @Column({ name: 'remote_port' })
    remotePort: number

    @AutoMap()
    @Column({ default: () => StatusEnum.Checking })
    status: number

    @AutoMap()
    @Column({ name: 'load_balancing', default: () => NginxLoadBalancingEnum.poll })
    loadBalancing: number

    @AutoMap()
    @Column({ nullable: true })
    commment: string
}
