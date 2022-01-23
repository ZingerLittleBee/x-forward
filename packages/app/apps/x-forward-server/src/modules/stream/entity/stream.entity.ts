import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { ProtocolEnum, RetriesEnum, StatusEnum } from '@x-forward/common'
import {
    enumToString,
    getValuesOfEnum,
    LoadBalancingEnum,
    SpeedUnitEnum,
    StreamItemEnum,
    StreamTipsEnum,
    TimeUnitEnum
} from '@x-forward/shared'
import { IsPort } from '@x-forward/common'
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'
import { IsHost, IsNginxUnit } from '@x-forward/common/decorators/valid.decorator'

@Entity('stream')
export class StreamEntity extends CommonEntity {
    @IsHost()
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.TransitHost })
    @Column({ name: 'transit_host', type: 'varchar', nullable: true })
    transitHost?: string

    @IsPort()
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.TransitPort })
    @Column({ name: 'transit_port', type: 'int', nullable: true })
    transitPort?: number

    @IsHost()
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RemoteHost })
    @Column({ name: 'remote_host', type: 'varchar', nullable: true })
    remoteHost?: string

    @IsNumber()
    @IsPort()
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RemotePort })
    @Column({ name: 'remote_port', type: 'int', nullable: true })
    remotePort?: number

    @IsOptional()
    @IsEnum(StatusEnum)
    @AutoMap()
    @ApiProperty({
        enum: getValuesOfEnum(StatusEnum),
        description: `${StreamItemEnum.Status}, ${enumToString(StatusEnum)}`
    })
    @Column({ type: 'int', default: () => StatusEnum.Checking })
    status?: StatusEnum

    @IsOptional()
    @IsEnum(LoadBalancingEnum)
    @AutoMap()
    @ApiProperty({
        enum: getValuesOfEnum(LoadBalancingEnum),
        description: `${StreamItemEnum.LoadBalancing}, ${enumToString(LoadBalancingEnum)}`
    })
    @Column({ name: 'load_balancing', type: 'int', default: () => LoadBalancingEnum.Random })
    loadBalancing?: LoadBalancingEnum

    @IsOptional()
    @IsEnum(ProtocolEnum)
    @AutoMap()
    @ApiProperty({ enum: getValuesOfEnum(ProtocolEnum), description: StreamItemEnum.Protocol })
    @Column({ name: 'protocol', type: 'varchar', nullable: true })
    protocol?: ProtocolEnum

    @IsOptional()
    @IsEnum(RetriesEnum)
    @AutoMap()
    @ApiProperty({ enum: getValuesOfEnum(RetriesEnum), description: StreamItemEnum.IsRetries })
    @Column({ name: 'is_retries', type: 'varchar', nullable: true })
    isRetries?: RetriesEnum

    @IsOptional()
    @IsNumber()
    @Min(0)
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.Tries })
    @Column({ name: 'tries', type: 'int', nullable: true })
    tries?: number

    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.RetriesTimeout })
    @Column({ name: 'retries_timeout', type: 'varchar', nullable: true })
    retriesTimeout?: string

    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.ConnectTimeout })
    @Column({ name: 'connect_timeout', type: 'varchar', nullable: true })
    connectTimeout?: string

    @IsOptional()
    @IsNginxUnit(SpeedUnitEnum)
    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.UploadRate}, ${StreamTipsEnum.UploadRate}`
    })
    @Column({ name: 'upload_rate', type: 'varchar', nullable: true })
    uploadRate?: string

    @IsOptional()
    @IsNginxUnit(SpeedUnitEnum)
    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.DownloadRate}, ${StreamTipsEnum.DownloadRate}`
    })
    @Column({ name: 'download_rate', type: 'varchar', nullable: true })
    downloadRate?: string

    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @AutoMap()
    @ApiProperty({
        description: `${StreamItemEnum.ProxyTimeout}, ${StreamTipsEnum.ProxyTimeout}`
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
