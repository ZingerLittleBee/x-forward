import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { CreateUpstreamDto } from './dto/create-upstream.dto'
import { UpdateUpstreamDto } from './dto/update-upstream.dto'
import { UpstreamEntity } from './entity/upstream.entity'
import { UpstreamVo } from './vo/upstream.vo'

export class UpstreamProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(UpstreamEntity, CreateUpstreamDto)
            mapper.createMap(CreateUpstreamDto, UpstreamEntity)
            mapper.createMap(UpstreamVo, UpstreamEntity)
            mapper.createMap(UpstreamEntity, UpstreamVo)
            mapper.createMap(UpdateUpstreamDto, UpstreamEntity)
            mapper.createMap(UpstreamEntity, UpdateUpstreamDto)
        }
    }
}
