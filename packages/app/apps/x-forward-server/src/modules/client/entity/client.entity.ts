import { Column, Entity } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional } from 'class-validator'
import { IsHost } from '@x-forward/common'
import { AutoMap } from '@automapper/classes'
import { IsOrNotEnum, getValuesOfEnum, enumToString } from '@x-forward/shared'

@Entity('client')
export class ClientEntity extends CommonEntity {
    @AutoMap()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar' })
    ip?: string

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty()
    @Column({ type: 'varchar', nullable: true })
    domain?: string

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
