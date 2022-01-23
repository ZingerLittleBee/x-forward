import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { LoadBalancingEnum, UpstreamEnum } from '@x-forward/shared'
import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { ServerEntity } from '../../server/entity/server.entity'
import { IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @IsString()
    @AutoMap()
    @ApiProperty({ description: 'upstream_name' })
    @Column({ type: 'varchar' })
    name: string

    @IsEnum(LoadBalancingEnum)
    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: `${UpstreamEnum.LoadBalancing}, ${LoadBalancingEnum}`
    })
    @Column({ name: 'load_balancing', type: 'tinyint', nullable: true, default: () => LoadBalancingEnum.Random })
    loadBalancing?: LoadBalancingEnum

    @ValidateNested({ each: true })
    @Type(() => StreamEntity)
    @AutoMap({ typeFn: () => StreamEntity })
    @ApiProperty()
    @OneToMany(() => StreamEntity, stream => stream.upstreamId, { eager: true, createForeignKeyConstraints: false })
    stream?: StreamEntity[]

    @ValidateNested({ each: true })
    @Type(() => ServerEntity)
    @AutoMap({ typeFn: () => ServerEntity })
    @ApiProperty()
    @OneToMany(() => ServerEntity, server => server.upstreamId, { eager: true, createForeignKeyConstraints: false })
    server: ServerEntity[]
}
