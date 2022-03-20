import { AutoMap } from '@automapper/classes'
import { OmitType } from '@nestjs/swagger'
import { IsOrNotEnum } from '@x-forward/shared'
import { ClientEntity } from '../entity/client.entity'

export class ClientVo extends OmitType(ClientEntity, ['port', 'deleteTime', 'createTime', 'state']) {
    @AutoMap()
    id?: string

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

    @AutoMap()
    comment?: string
}
