import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

export abstract class CommonEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: true })
    state: number

    @CreateDateColumn({ name: 'create_time' })
    createTime: Date

    @UpdateDateColumn({ name: 'update_time' })
    updateTime: Date

    @DeleteDateColumn({ name: 'delete_time', nullable: true })
    deleteTime: Date
}
