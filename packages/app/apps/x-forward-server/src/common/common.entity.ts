import { AutoMap } from '@automapper/classes'
import { enumToString, getValuesOfEnum, StateEnum } from '@forwardx/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
export abstract class CommonEntity {
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @IsOptional()
    @IsEnum(StateEnum)
    @AutoMap()
    @ApiProperty({ enum: getValuesOfEnum(StateEnum), description: `是否生效; ${enumToString(StateEnum)}` })
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
