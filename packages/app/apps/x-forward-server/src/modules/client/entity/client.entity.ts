import { AutoMap } from '@automapper/classes'
import { ApiProperty } from '@nestjs/swagger'
import { IsHost } from '@x-forward/common'
import { enumToString, getValuesOfEnum, IsOrNotEnum } from '@x-forward/shared'
import { IsDate, IsEnum, IsOptional, IsPort } from 'class-validator'
import { Column, Entity } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'

@Entity('client')
export class ClientEntity extends CommonEntity {
    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    ip?: string

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    domain?: string

    @AutoMap()
    @IsOptional()
    @IsPort()
    @ApiProperty()
    @Column({ type: 'tinyint', nullable: true, default: () => 3000 })
    communicationPort?: string | number

    @AutoMap()
    @IsOptional()
    @IsEnum(IsOrNotEnum)
    @ApiProperty({
        enum: getValuesOfEnum(IsOrNotEnum),
        description: `${enumToString(IsOrNotEnum)}`
    })
    isOnline?: IsOrNotEnum

    @AutoMap()
    @IsOptional()
    @IsDate()
    @ApiProperty()
    @Column({ nullable: true })
    lastCommunicationTime?: Date
}
