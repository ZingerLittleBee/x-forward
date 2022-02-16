import { PickType } from '@nestjs/swagger'
import { ClientEntity } from '../entity/client.entity'

export class ClientVo extends PickType(ClientEntity, ['id', 'ip', 'domain']) {}
