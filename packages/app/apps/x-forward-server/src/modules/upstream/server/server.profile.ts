import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { CreateServerDto } from './dto/create-server.dto'
import { UpdateServerDto } from './dto/update-server.dto'
import { ServerEntity } from './entities/server.entity'
import { ServerVo } from './server.vo'

export class ServerProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(ServerEntity, CreateServerDto), mapper.createMap(CreateServerDto, ServerEntity)
            mapper.createMap(ServerEntity, ServerVo), mapper.createMap(ServerVo, ServerEntity)
            mapper.createMap(ServerEntity, UpdateServerDto), mapper.createMap(UpdateServerDto, ServerEntity)
        }
    }
}
