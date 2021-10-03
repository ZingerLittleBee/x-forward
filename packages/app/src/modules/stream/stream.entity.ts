import { CommonEntity } from 'src/common/common.entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Stream extends CommonEntity {
    @Column({ name: 'transit_host' })
    transitHost: string

    @Column({ name: 'transit_port' })
    transitPort: number

    @Column({ name: 'remote_host' })
    remoteHost: string

    @Column({ name: 'remote_port' })
    remotePort: number

    @Column({ nullable: true })
    status: number

    @Column({ name: 'load_balancing', nullable: true })
    loadBalancing: number

    @Column({ nullable: true })
    commment: string
}
