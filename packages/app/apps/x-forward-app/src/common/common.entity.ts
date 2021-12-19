import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { StateEnum } from '../enums/StatusEnum'

export abstract class CommonEntity {
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @AutoMap()
    @ApiProperty({ enum: [0, 1], description: '是否生效; 0: able, 1: disable' })
    @Column({ default: () => StateEnum.Able })
    state?: StateEnum

    @AutoMap()
    @ApiProperty()
    @CreateDateColumn({ name: 'create_time' })
    createTime?: Date

    @AutoMap()
    @ApiProperty()
    @UpdateDateColumn({ name: 'update_time' })
    updateTime?: Date

    @AutoMap()
    @ApiProperty()
    @DeleteDateColumn({ name: 'delete_time', nullable: true })
    deleteTime?: Date
}
