import { AutoMap } from '@automapper/classes'
import { enumToString, getValuesOfEnum, LoadBalancingEnum, UpstreamEnum } from '@forwardx/shared'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { ClientEntity } from '../../client/entity/client.entity'
import { ServerEntity } from '../../server/entity/server.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'

@Entity('upstream')
export class UpstreamEntity extends CommonEntity {
    @AutoMap({ typeFn: () => ClientEntity })
    @ApiProperty()
    @ManyToOne(() => ClientEntity, client => client.upstream, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({ name: 'client_id' })
    client?: ClientEntity

    @AutoMap()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Column({ name: 'client_id', nullable: true })
    clientId?: string

    @IsOptional()
    @IsString()
    @AutoMap()
    @ApiProperty({ description: 'upstream_name' })
    @Column({ type: 'varchar', unique: true })
    name: string

    @IsOptional()
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
    @OneToMany(() => StreamEntity, stream => stream.upstream, {
        cascade: ['insert', 'update'],
        eager: true,
        createForeignKeyConstraints: false
    })
    stream?: StreamEntity[]

    @ValidateNested({ each: true })
    @Type(() => ServerEntity)
    @AutoMap({ typeFn: () => ServerEntity })
    @ApiProperty()
    @OneToMany(() => ServerEntity, server => server.upstream, {
        cascade: true,
        eager: true,
        createForeignKeyConstraints: false
    })
    server: ServerEntity[]
}
