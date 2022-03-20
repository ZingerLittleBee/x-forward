import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { IsHost } from '@x-forward/common'
import { enumToString, getValuesOfEnum, IsOrNotEnum } from '@x-forward/shared'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsPort, ValidateNested } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'

@Entity('client')
export class ClientEntity extends CommonEntity {
    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    ip?: string

    @AutoMap()
    @IsOptional()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    name?: string

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    domain?: string

    @AutoMap()
    @IsOptional()
    @IsPort()
    @ApiProperty()
    @Column({ type: 'tinyint', nullable: true, default: () => 5000 })
    port?: number

    @AutoMap()
    @IsOptional()
    @IsEnum(IsOrNotEnum)
    @ApiProperty({
        enum: getValuesOfEnum(IsOrNotEnum),
        description: `${enumToString(IsOrNotEnum)}`
    })
    @Column({ nullable: true, default: () => IsOrNotEnum.False })
    isOnline?: IsOrNotEnum

    @AutoMap()
    @IsOptional()
    @IsDate()
    @ApiProperty()
    @Column({ nullable: true })
    lastCommunicationTime?: Date

    @AutoMap()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    comment?: string

    @ValidateNested({ each: true })
    @Type(() => StreamEntity)
    @AutoMap({ typeFn: () => StreamEntity })
    @ApiProperty()
    @OneToMany(() => StreamEntity, stream => stream.client, {
        cascade: true,
        eager: true,
        createForeignKeyConstraints: false
    })
    stream?: StreamEntity[]

    @ValidateNested({ each: true })
    @Type(() => UpstreamEntity)
    @AutoMap({ typeFn: () => UpstreamEntity })
    @ApiProperty()
    @OneToMany(() => UpstreamEntity, upstream => upstream.client, {
        cascade: true,
        eager: true,
        createForeignKeyConstraints: false
    })
    upstream?: UpstreamEntity[]
}
