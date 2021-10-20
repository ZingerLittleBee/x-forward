import { CommonEntity } from 'src/common/common.entity'
import { Column, Entity } from 'typeorm'

@Entity()
export class User extends CommonEntity {
    @Column()
    username: string

    @Column()
    password: string

    @Column({ nullable: true })
    comment: string
}