import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { LoadBalancingEnum, UpstreamEnum } from '@x-forward/shared'
import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { ServerEntity } from '../../server/entity/server.entity'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: 'upstream_name' })
    @Column({ type: 'varchar' })
    name: string

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: `${UpstreamEnum.LoadBalancing}, ${LoadBalancingEnum}`
    })
    @Column({ name: 'load_balancing', type: 'tinyint', nullable: true, default: () => LoadBalancingEnum.Random })
    loadBalancing?: LoadBalancingEnum

    @AutoMap({ typeFn: () => StreamEntity })
    @ApiProperty()
    @OneToMany(() => StreamEntity, stream => stream.upstreamId, { eager: true, createForeignKeyConstraints: false })
    stream?: StreamEntity[]

    @AutoMap({ typeFn: () => ServerEntity })
    @ApiProperty()
    @OneToMany(() => ServerEntity, server => server.upstreamId, { eager: true, createForeignKeyConstraints: false })
    server: ServerEntity[]
}
