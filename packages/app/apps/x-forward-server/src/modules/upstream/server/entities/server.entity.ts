import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { enumToString, IsOrNot, ServerEnum, ServerTipsEnum } from '@x-forward/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '../../../../common/common.entity'
import { UpstreamEntity } from '../../upstream.entity'

@Entity('server')
export class ServerEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: ServerEnum.UpstreamHost })
    @Column({ name: 'upstream_host', type: 'varchar' })
    upstreamHost: string

    @AutoMap()
    @ApiProperty({ description: ServerEnum.UpstreamPort })
    @Column({ name: 'upstream_port', type: 'smallint' })
    upstreamPort: number

    @AutoMap()
    @ApiProperty({ description: `${ServerEnum.Weight}, ${ServerTipsEnum.Weight}` })
    @Column({ type: 'tinyint', nullable: true })
    weight?: number

    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.MaxCons}, ${ServerTipsEnum.MaxCons}`
    })
    @Column({ name: 'max_cons', type: 'smallint', nullable: true })
    maxCons?: number

    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.MaxFails}, ${ServerTipsEnum.MaxFails}`
    })
    @Column({ name: 'max_fails', type: 'int', nullable: true })
    maxFails?: number

    @AutoMap()
    @ApiProperty({
        description: `${ServerEnum.FailTimeout}, ${ServerTipsEnum.FailTimeout}`
    })
    @Column({ name: 'fail_timeout', type: 'varchar', nullable: true })
    failTimeout?: string

    // 。
    // 。
    @AutoMap()
    @ApiProperty({
        enum: [0, 1],
        description: `${ServerEnum.FailTimeout}, ${ServerTipsEnum.FailTimeout}, ${enumToString(IsOrNot)}`
    })
    @Column({ type: 'tinyint', nullable: true })
    backup?: 0 | 1

    // 。
    @AutoMap()
    @ApiProperty({ enum: [0, 1], description: `${ServerEnum.Down}, ${ServerTipsEnum.Down}, ${enumToString(IsOrNot)}` })
    @Column({ type: 'tinyint', nullable: true })
    down?: 0 | 1

    @ApiProperty()
    @ManyToOne(() => UpstreamEntity, upstream => upstream.server, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstreamId?: string
}
