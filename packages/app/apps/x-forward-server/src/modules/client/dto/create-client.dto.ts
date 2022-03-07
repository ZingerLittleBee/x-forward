import { AutoMap } from '@automapper/classes'
import { PartialType } from '@nestjs/swagger'
import { IsOrNotEnum } from '@x-forward/shared'
import { ClientEntity } from '../entity/client.entity'

export class CreateClientDto extends PartialType(ClientEntity) {
    @AutoMap()
    ip?: string

    @AutoMap()
    domain?: string

    @AutoMap()
    port?: string | number

    @AutoMap()
    isOnline?: IsOrNotEnum

    @AutoMap()
    lastCommunicationTime?: Date
}
