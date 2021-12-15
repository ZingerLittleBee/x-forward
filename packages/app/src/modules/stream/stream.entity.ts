import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from 'src/common/common.entity'
import { NginxLoadBalancingEnum, ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { StatusEnum } from 'src/enums/StatusEnum'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UpstreamEntity } from '../upstream/upstream.entity'

@Entity('stream')
export class StreamEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: '中转地址' })
    @Column({ name: 'transit_host', type: 'varchar' })
    transitHost: string

    @AutoMap()
    @ApiProperty({ description: '中转端口' })
    @Column({ name: 'transit_port', type: 'int' })
    transitPort: number

    @AutoMap()
    @ApiProperty({ description: '上游地址' })
    @Column({ name: 'remote_host', type: 'varchar', nullable: true })
    remoteHost?: string

    @AutoMap()
    @ApiProperty({ description: '上游端口' })
    @Column({ name: 'remote_port', type: 'int', nullable: true })
    remotePort?: number

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: `联通状态, ${StatusEnum.Checking}: Checking, ${StatusEnum.Running}: Running, ${StatusEnum.Stop}: Stop, ${StatusEnum.NotInstall}: NotInstall, ${StatusEnum.Error}: Error`
    })
    @Column({ type: 'int', default: () => StatusEnum.Checking })
    status?: StatusEnum

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: '负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash'
    })
    @Column({ name: 'load_balancing', type: 'int', default: () => NginxLoadBalancingEnum.poll })
    loadBalancing?: NginxLoadBalancingEnum

    @AutoMap()
    @ApiProperty({ enum: ['tcp', 'udp'], description: '转发协议' })
    @Column({ name: 'protocol', type: 'varchar', nullable: true })
    protocol?: ProtocolEnum

    @AutoMap()
    @ApiProperty({ enum: ['on', 'off'], description: '失败重试' })
    @Column({ name: 'is_retries', type: 'varchar', nullable: true })
    isRetries?: RetriesEnum

    @AutoMap()
    @ApiProperty({ description: '重试次数' })
    @Column({ name: 'tries', type: 'int', nullable: true })
    tries?: number

    @AutoMap()
    @ApiProperty({ description: '重试超时时间' })
    @Column({ name: 'retries_timeout', type: 'varchar', nullable: true })
    retriesTimeout?: string

    @AutoMap()
    @ApiProperty({ description: '连接超时时间' })
    @Column({ name: 'connect_timeout', type: 'varchar', nullable: true })
    connectTimeout?: string

    @AutoMap()
    @ApiProperty({ description: '从客户端读数据的速率，单位为每秒字节数，默认为0，不限速' })
    @Column({ name: 'upload_rate', type: 'varchar', nullable: true })
    uploadRate?: string

    @AutoMap()
    @ApiProperty({ description: '从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速' })
    @Column({ name: 'download_rate', type: 'varchar', nullable: true })
    downloadRate?: string

    @AutoMap()
    @ApiProperty({
        description:
            '配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟'
    })
    @Column({ name: 'proxy_timeout', type: 'varchar', nullable: true })
    proxyTimeout?: string

    @AutoMap()
    @ApiProperty({ description: '备注' })
    @Column({ name: 'comment', type: 'varchar', nullable: true })
    comment?: string

    @AutoMap({ typeFn: () => UpstreamEntity })
    @ApiProperty()
    @ManyToOne(() => UpstreamEntity, upstream => upstream.server, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstreamId?: string
}
