import { Column, Entity } from 'typeorm'
import { CommonEntity } from '../../../common/common.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsHost } from '@x-forward/common'
import { AutoMap } from '@automapper/classes'

@Entity('client')
export class ClientEntity extends CommonEntity {
    @AutoMap()
    @IsHost()
    @ApiProperty({
        description: 'ip'
    })
    @Column({ type: 'varchar' })
    ip?: string

    @AutoMap()
    @IsOptional()
    @IsHost()
    @ApiProperty({
        description: 'domain'
    })
    @Column({ type: 'varchar', nullable: true })
    domain?: string
}
