import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
import { CommonEntity } from '../../common/common.entity'
import { enumToString, RoleEnum, UserEnum } from '@x-forward/shared'

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
    role: RoleEnum

    @AutoMap()
    @ApiProperty({ description: UserEnum.Comment })
    @Column({ nullable: true })
    comment?: string
}
