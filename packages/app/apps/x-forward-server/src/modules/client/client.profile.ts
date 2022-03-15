import { Mapper } from '@automapper/core'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { Injectable } from '@nestjs/common'
import { CreateClientDto } from './dto/create-client.dto'
import { ClientEntity } from './entity/client.entity'
import { ClientVo } from './vo/client.vo'

@Injectable()
export class ClientProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(ClientEntity, CreateClientDto)
            mapper.createMap(CreateClientDto, ClientEntity)
            mapper.createMap(ClientVo, ClientEntity)
            mapper.createMap(ClientEntity, ClientVo)
        }
    }
}
