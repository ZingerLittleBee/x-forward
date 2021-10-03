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

    @Column({ nullable: true })
    state: number

    @CreateDateColumn({ name: 'create_time', nullable: true })
    createTime: Date

    @UpdateDateColumn({ name: 'update_time', nullable: true })
    updateTime: Date

    @DeleteDateColumn({ name: 'delete_time', nullable: true })
    deleteTime: Date
}
