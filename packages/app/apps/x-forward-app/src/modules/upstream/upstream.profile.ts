import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { CreateUpstreamDto } from './create-upstream.dto'
import { UpdateUpstreamDto } from './update-upstream.dto'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamVo } from './upstream.vo'

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
