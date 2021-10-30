import { AutoMap } from '@automapper/classes'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { Column, Entity, OneToMany } from 'typeorm'
import { ServerEntity } from './server/entities/server.entity'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @AutoMap()
    @Column({ type: 'varchar', unique: true })
    name: string

    @AutoMap()
    @Column({ name: 'load_balancing', type: 'tinyint', nullable: true })
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => ServerEntity })
    @OneToMany(() => ServerEntity, server => server.upstream, { eager: true, createForeignKeyConstraints: false })
    server: ServerEntity[]
}
