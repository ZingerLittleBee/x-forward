import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { enumToString, LoadBalancingEnum, UpstreamEnum } from '@x-forward/shared'
import { Type } from 'class-transformer'
import { IsEnum, IsString, ValidateNested } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { ServerEntity } from '../../server/entity/server.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { getValuesOfEnum } from '@x-forward/shared'

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
        enum: getValuesOfEnum(LoadBalancingEnum),
        description: `${UpstreamEnum.LoadBalancing}, ${enumToString(LoadBalancingEnum)}`
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
