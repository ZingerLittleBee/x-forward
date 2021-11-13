import { AutoMap } from '@automapper/classes'
import { CommonEntity } from 'src/common/common.entity'
import { Column, Entity } from 'typeorm'

@Entity('user')
export class UserEntity extends CommonEntity {
    @AutoMap()
    @Column({ name: 'username', unique: true })
    username: string

    @AutoMap()
    @Column({ name: 'password' })
    password: string

    @AutoMap()
    @Column({ nullable: true })
    comment?: string
}
