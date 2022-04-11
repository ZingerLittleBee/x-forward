import { AutoMap } from '@automapper/classes'
import { enumToString, getValuesOfEnum, IsOrNotEnum, ServerEnum, ServerTipsEnum, TimeUnitEnum } from '@forwardx/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsPort } from '@x-forward/common'
import { IsHost, IsNginxUnit } from '@x-forward/common/decorators/valid.decorator'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'

@Entity('server')
export class ServerEntity extends CommonEntity {
    @IsNotEmpty()
    @IsHost()
    @AutoMap()
    @ApiProperty({ description: ServerEnum.UpstreamHost })
    @Column({ name: 'upstream_host', type: 'varchar' })
    upstreamHost: string

    @IsNotEmpty()
    @IsPort()
    @AutoMap()
    @ApiProperty({ description: ServerEnum.UpstreamPort })
    @Column({ name: 'upstream_port', type: 'smallint' })
    upstreamPort: number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @AutoMap()
    @ApiProperty({ description: `${ServerEnum.Weight}, ${ServerTipsEnum.Weight}` })
    @Column({ type: 'tinyint', nullable: true })
    weight?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.MaxCons}, ${ServerTipsEnum.MaxCons}`
    })
    @Column({ name: 'max_cons', type: 'smallint', nullable: true })
    maxCons?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.MaxFails}, ${ServerTipsEnum.MaxFails}`
    })
    @Column({ name: 'max_fails', type: 'int', nullable: true })
    maxFails?: number

    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.FailTimeout}, ${ServerTipsEnum.FailTimeout}`
    })
    @Column({ name: 'fail_timeout', type: 'varchar', nullable: true })
    failTimeout?: string

    @IsOptional()
    @IsEnum(IsOrNotEnum)
    @AutoMap()
    @ApiProperty({
        enum: getValuesOfEnum(IsOrNotEnum),
        description: `${ServerEnum.FailTimeout}, ${ServerTipsEnum.FailTimeout}, ${enumToString(IsOrNotEnum)}`
    })
    @Column({ type: 'tinyint', nullable: true })
    backup?: IsOrNotEnum

    @IsOptional()
    @IsEnum(IsOrNotEnum)
    @AutoMap()
    @ApiProperty({
        enum: getValuesOfEnum(IsOrNotEnum),
        description: `${ServerEnum.Down}, ${ServerTipsEnum.Down}, ${enumToString(IsOrNotEnum)}`
    })
    @Column({ type: 'tinyint', nullable: true })
    down?: IsOrNotEnum

    @AutoMap({ typeFn: () => UpstreamEntity })
    @ApiProperty()
    @ManyToOne(() => UpstreamEntity, upstream => upstream.server, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstream?: UpstreamEntity

    @AutoMap()
    @ApiProperty()
    @Column({ name: 'upstream_id', nullable: true })
    upstreamId?: string
}
