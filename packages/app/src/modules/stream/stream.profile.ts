import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { StreamDto } from './stream.dto'
import { StreamEntity } from './stream.entity'
import { StreamVo } from './stream.vo'

export class StreamProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(StreamEntity, StreamDto)
            mapper.createMap(StreamDto, StreamEntity)
            mapper.createMap(StreamEntity, StreamVo)
            mapper.createMap(StreamVo, StreamEntity)
        }
    }
}
