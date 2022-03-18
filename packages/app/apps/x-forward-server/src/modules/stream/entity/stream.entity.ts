import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { IsPort, ProtocolEnum, RetriesEnum, StatusEnum } from '@x-forward/common'
import { IsHost, IsNginxUnit } from '@x-forward/common/decorators/valid.decorator'
import {
    enumToString,
    getValuesOfEnum,
    SpeedUnitEnum,
    StreamItemEnum,
    StreamTipsEnum,
    TimeUnitEnum
} from '@x-forward/shared'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { ClientEntity } from '../../client/entity/client.entity'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'
import { UserEntity } from '../../user/user.entity'

@Entity('stream')
export class StreamEntity extends CommonEntity {
    @AutoMap({ typeFn: () => UserEntity })
    @IsOptional()
    @IsString()
    @ApiProperty()
    @ManyToOne(() => UserEntity, user => user.stream, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity

    @AutoMap()
    @IsOptional()
    @IsString()
    @ApiProperty()
    @Column({ name: 'user_id', nullable: true })
    userId?: string

    @AutoMap({ typeFn: () => ClientEntity })
    @ApiProperty()
    @ManyToOne(() => ClientEntity, client => client.stream, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'client_id' })
    client?: ClientEntity

    @AutoMap()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Column({ name: 'client_id', nullable: true })
    clientId?: string

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty({ description: StreamItemEnum.TransitHost })
    @Column({ name: 'transit_host', type: 'varchar', nullable: true })
    transitHost?: string

    @AutoMap()
    @IsOptional()
    @IsPort()
    @ApiProperty({ description: StreamItemEnum.TransitPort })
    @Column({ name: 'transit_port', type: 'int', nullable: true })
    transitPort?: number

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty({ description: StreamItemEnum.RemoteHost })
    @Column({ name: 'remote_host', type: 'varchar', nullable: true })
    remoteHost?: string

    @AutoMap()
    @IsOptional()
    @IsNumber()
    @IsPort()
    @ApiProperty({ description: StreamItemEnum.RemotePort })
    @Column({ name: 'remote_port', type: 'int', nullable: true })
    remotePort?: number

    @AutoMap()
    @IsOptional()
    @IsEnum(StatusEnum)
    @ApiProperty({
        enum: getValuesOfEnum(StatusEnum),
        description: `${StreamItemEnum.Status}, ${enumToString(StatusEnum)}`
    })
    @Column({ type: 'int', default: () => StatusEnum.Checking })
    status?: StatusEnum

    @AutoMap()
    @IsOptional()
    @IsEnum(ProtocolEnum)
    @ApiProperty({ enum: getValuesOfEnum(ProtocolEnum), description: StreamItemEnum.Protocol })
    @Column({ name: 'protocol', type: 'varchar', nullable: true })
    protocol?: ProtocolEnum

    @AutoMap()
    @IsOptional()
    @IsEnum(RetriesEnum)
    @ApiProperty({ enum: getValuesOfEnum(RetriesEnum), description: StreamItemEnum.IsRetries })
    @Column({ name: 'is_retries', type: 'varchar', nullable: true })
    isRetries?: RetriesEnum

    @AutoMap()
    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ description: StreamItemEnum.Tries })
    @Column({ name: 'tries', type: 'int', nullable: true })
    tries?: number

    @AutoMap()
    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @ApiProperty({ description: StreamItemEnum.RetriesTimeout })
    @Column({ name: 'retries_timeout', type: 'varchar', nullable: true })
    retriesTimeout?: string

    @AutoMap()
    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @ApiProperty({ description: StreamItemEnum.ConnectTimeout })
    @Column({ name: 'connect_timeout', type: 'varchar', nullable: true })
    connectTimeout?: string

    @AutoMap()
    @IsOptional()
    @IsNginxUnit(SpeedUnitEnum)
    @ApiProperty({
        description: `${StreamItemEnum.UploadRate}, ${StreamTipsEnum.UploadRate}`
    })
    @Column({ name: 'upload_rate', type: 'varchar', nullable: true })
    uploadRate?: string

    @AutoMap()
    @IsOptional()
    @IsNginxUnit(SpeedUnitEnum)
    @ApiProperty({
        description: `${StreamItemEnum.DownloadRate}, ${StreamTipsEnum.DownloadRate}`
    })
    @Column({ name: 'download_rate', type: 'varchar', nullable: true })
    downloadRate?: string

    @AutoMap()
    @IsOptional()
    @IsNginxUnit(TimeUnitEnum)
    @ApiProperty({
        description: `${StreamItemEnum.ProxyTimeout}, ${StreamTipsEnum.ProxyTimeout}`
    })
    @Column({ name: 'proxy_timeout', type: 'varchar', nullable: true })
    proxyTimeout?: string

    @AutoMap()
    @ApiProperty({ description: StreamItemEnum.Comment })
    @Column({ name: 'comment', type: 'varchar', nullable: true })
    comment?: string

    @AutoMap()
    @ApiProperty()
    @ManyToOne(() => UpstreamEntity, upstream => upstream.stream, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'upstream_id' })
    upstream?: UpstreamEntity

    @AutoMap()
    @ApiProperty()
    @Column({ name: 'upstream_id', nullable: true })
    upstreamId?: string
}
