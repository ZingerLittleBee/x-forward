import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { ProtocolEnum, RetriesEnum, StatusEnum } from '@x-forward/common'
import { LoadBalancingEnum, StreamItemEnum, enumToString } from '@x-forward/shared'
import { IsInt, IsNumber, Max, Min } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '../../common/common.entity'
import { UpstreamEntity } from '../upstream/upstream.entity'

@Entity('stream')
export class StreamEntity extends CommonEntity {
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.TransitHost })
    @Column({ name: 'transit_host', type: 'varchar', nullable: true })
    transitHost?: string

    @IsInt()
    @Min(0)
    @Max(65535)
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.TransitPort })
    @Column({ name: 'transit_port', type: 'int', nullable: true })
    transitPort?: number

    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RemoteHost })
    @Column({ name: 'remote_host', type: 'varchar', nullable: true })
    remoteHost?: string

    @IsInt()
    @Min(0)
    @Max(65535)
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RemotePort })
    @Column({ name: 'remote_port', type: 'int', nullable: true })
    remotePort?: number

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: `${StreamItemEnum.Status}, ${enumToString(StatusEnum)}`
    })
    @Column({ type: 'int', default: () => StatusEnum.Checking })
    status?: StatusEnum

    @AutoMap()
    @ApiProperty({
        enum: [0, 1, 2, 3, 4],
        description: `${StreamItemEnum.LoadBalancing}, ${enumToString(LoadBalancingEnum)}`
    })
    @Column({ name: 'load_balancing', type: 'int', default: () => LoadBalancingEnum.Random })
    loadBalancing?: LoadBalancingEnum

    @AutoMap()
    @ApiProperty({ enum: ['tcp', 'udp'], description: StreamItemEnum.Protocol })
    @Column({ name: 'protocol', type: 'varchar', nullable: true })
    protocol?: ProtocolEnum

    @AutoMap()
    @ApiProperty({ enum: ['on', 'off'], description: StreamItemEnum.IsRetries })
    @Column({ name: 'is_retries', type: 'varchar', nullable: true })
    isRetries?: RetriesEnum

    @IsNumber()
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.Tries })
    @Column({ name: 'tries', type: 'int', nullable: true })
    tries?: number

    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RetriesTimeout })
    @Column({ name: 'retries_timeout', type: 'varchar', nullable: true })
    retriesTimeout?: string

    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.ConnectTimeout })
    @Column({ name: 'connect_timeout', type: 'varchar', nullable: true })
    connectTimeout?: string

    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.UploadRate}, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速`
    })
    @Column({ name: 'upload_rate', type: 'varchar', nullable: true })
    uploadRate?: string

    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.DownloadRate}, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速`
    })
    @Column({ name: 'download_rate', type: 'varchar', nullable: true })
    downloadRate?: string

    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.ProxyTimeout}, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟`
    })
    @Column({ name: 'proxy_timeout', type: 'varchar', nullable: true })
    proxyTimeout?: string

    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.Comment })
    @Column({ name: 'comment', type: 'varchar', nullable: true })
    comment?: string

    @AutoMap({ typeFn: () => UpstreamEntity })
    @ApiProperty()
    @ManyToOne(() => UpstreamEntity, upstream => upstream.server, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstreamId?: string
}
