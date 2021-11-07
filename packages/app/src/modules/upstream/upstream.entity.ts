import { AutoMap } from '@automapper/classes'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { Column, Entity, OneToMany } from 'typeorm'
import { StreamEntity } from '../stream/stream.entity'
import { ServerEntity } from './server/entities/server.entity'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @AutoMap()
    // @Column({ type: 'varchar', unique: true })
    // TODO to make develop easy
    @Column({ type: 'varchar' })
    name: string

    @AutoMap()
    @Column({ name: 'load_balancing', type: 'tinyint', nullable: true, default: () => NginxLoadBalancingEnum.poll })
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => StreamEntity })
    @OneToMany(() => StreamEntity, stream => stream.upstreamId, { eager: true, createForeignKeyConstraints: false })
    stream?: StreamEntity[]

    @AutoMap({ typeFn: () => ServerEntity })
    @OneToMany(() => ServerEntity, server => server.upstream, { eager: true, createForeignKeyConstraints: false })
    server: ServerEntity[]
}
