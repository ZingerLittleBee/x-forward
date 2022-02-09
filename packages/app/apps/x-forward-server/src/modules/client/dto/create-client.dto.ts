import { PartialType } from '@nestjs/swagger'
import { ClientEntity } from '../entity/client.entity'

export class CreateClientDto extends PartialType(ClientEntity) {}
