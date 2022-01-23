import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { StateEnum } from '@x-forward/common'
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IsEnum, IsOptional } from 'class-validator'
import { getValuesOfEnum } from '@x-forward/shared'
export abstract class CommonEntity {
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @IsOptional()
    @IsEnum(StateEnum)
    @AutoMap()
    @ApiProperty({ enum: getValuesOfEnum(StateEnum), description: '是否生效; 0: able, 1: disable' })
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
