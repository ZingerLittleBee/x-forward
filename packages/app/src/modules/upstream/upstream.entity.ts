import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { Column, Entity, OneToMany } from 'typeorm'
import { StreamEntity } from '../stream/stream.entity'
import { ServerEntity } from './server/entities/server.entity'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: 'upstream_name' })
    @Column({ type: 'varchar' })
    name: string

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: '负载均衡算法; 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash'
    })
    @Column({ name: 'load_balancing', type: 'tinyint', nullable: true, default: () => NginxLoadBalancingEnum.poll })
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap({ typeFn: () => StreamEntity })
    @ApiProperty()
    @OneToMany(() => StreamEntity, stream => stream.upstreamId, { eager: true, createForeignKeyConstraints: false })
    stream?: StreamEntity[]

    @AutoMap({ typeFn: () => ServerEntity })
    @ApiProperty()
    @OneToMany(() => ServerEntity, server => server.upstream, { eager: true, createForeignKeyConstraints: false })
    server: ServerEntity[]
}
