import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { enumToString, RoleEnum, UserEnum } from '@x-forward/shared'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from '../../common/common.entity'
import { StreamEntity } from '../stream/entity/stream.entity'

@Entity('user')
export class UserEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: UserEnum.Username })
    @Column({ name: 'username', unique: true })
    username: string

    @AutoMap()
    @ApiProperty({ description: UserEnum.Password })
    @Column({ name: 'password' })
    password: string

    @AutoMap()
    @ApiProperty({ description: `${UserEnum.Role}, ${enumToString(UserEnum)}` })
    @Column({ name: 'role', default: () => RoleEnum.User })
    role?: RoleEnum

    @AutoMap()
    @ApiProperty({ description: UserEnum.Comment })
    @Column({ nullable: true })
    comment?: string

    @ValidateNested({ each: true })
    @Type(() => StreamEntity)
    @AutoMap({ typeFn: () => StreamEntity })
    @ApiProperty()
    @OneToMany(() => StreamEntity, stream => stream.user, { eager: true, createForeignKeyConstraints: false })
    stream?: StreamEntity[]
}
