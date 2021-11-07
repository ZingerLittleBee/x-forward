import { AutoMap } from '@automapper/classes'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum, ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { StatusEnum } from 'src/enums/StatusEnum'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UpstreamEntity } from '../upstream/upstream.entity'

@Entity('stream')
export class StreamEntity extends CommonEntity {
    @AutoMap()
    @Column({ name: 'transit_host', type: 'varchar' })
    transitHost: string

    @AutoMap()
    @Column({ name: 'transit_port', type: 'int' })
    transitPort: number

    @AutoMap()
    @Column({ name: 'remote_host', type: 'varchar', nullable: true })
    remoteHost?: string

    @AutoMap()
    @Column({ name: 'remote_port', type: 'int', nullable: true })
    remotePort?: number

    @AutoMap()
    @Column({ type: 'int', default: () => StatusEnum.Checking })
    status?: number

    @AutoMap()
    @Column({ name: 'load_balancing', type: 'int', default: () => NginxLoadBalancingEnum.poll })
    loadBalancing?: number

    @AutoMap()
    @Column({ name: 'protocol', type: 'varchar', nullable: true })
    protocol?: ProtocolEnum

    @AutoMap()
    @Column({ name: 'is_retries', type: 'varchar', nullable: true })
    isRetries?: RetriesEnum

    @AutoMap()
    @Column({ name: 'tries', type: 'int', nullable: true })
    tries: number

    @AutoMap()
    @Column({ name: 'retries_timeout', type: 'varchar', nullable: true })
    retriesTimeout?: string

    @AutoMap()
    @Column({ name: 'connect_timeout', type: 'varchar', nullable: true })
    connectTimeout?: string

    @AutoMap()
    @Column({ name: 'upload_rate', type: 'varchar', nullable: true })
    uploadRate?: string

    @AutoMap()
    @Column({ name: 'download_rate', type: 'varchar', nullable: true })
    downloadRate?: string

    @AutoMap()
    @Column({ name: 'proxy_timeout', type: 'varchar', nullable: true })
    proxyTimeout?: string

    @AutoMap()
    @Column({ name: 'comment', type: 'varchar', nullable: true })
    comment?: string

    @AutoMap({ typeFn: () => UpstreamEntity })
    @ManyToOne(() => UpstreamEntity, upstream => upstream.server, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstreamId?: string
}
