import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { ClientEntity } from './entity/client.entity'
import { CreateClientDto } from './dto/create-client.dto'

export class ClientProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(ClientEntity, CreateClientDto)
            mapper.createMap(CreateClientDto, ClientEntity)
        }
    }
}
