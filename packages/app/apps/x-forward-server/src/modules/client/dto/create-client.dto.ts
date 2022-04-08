import { AutoMap } from '@automapper/classes'
import { IsOrNotEnum } from '@forwardx/shared'
import { PartialType } from '@nestjs/swagger'
import { ClientEntity } from '../entity/client.entity'

export class CreateClientDto extends PartialType(ClientEntity) {
    @AutoMap()
    ip?: string

    @AutoMap()
    domain?: string

    @AutoMap()
    port?: number

    @AutoMap()
    isOnline?: IsOrNotEnum

    @AutoMap()
    lastCommunicationTime?: Date
}
