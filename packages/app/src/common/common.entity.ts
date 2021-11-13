import { AutoMap } from '@automapper/classes'
import { StateEnum } from 'src/enums/StatusEnum'
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class CommonEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @AutoMap()
    @Column({ default: () => StateEnum.Able })
    state?: StateEnum

    @AutoMap()
    @CreateDateColumn({ name: 'create_time' })
    createTime?: Date

    @AutoMap()
    @UpdateDateColumn({ name: 'update_time' })
    updateTime?: Date

    @AutoMap()
    @DeleteDateColumn({ name: 'delete_time', nullable: true })
    deleteTime?: Date
}
