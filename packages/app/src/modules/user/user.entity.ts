import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from 'src/common/common.entity'
import { Column, Entity } from 'typeorm'

@Entity('user')
export class UserEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: '用户名' })
    @Column({ name: 'username', unique: true })
    username: string

    @AutoMap()
    @ApiProperty({ description: '密码' })
    @Column({ name: 'password' })
    password: string

    @AutoMap()
    @ApiProperty({ description: '备注' })
    @Column({ nullable: true })
    comment?: string
}
