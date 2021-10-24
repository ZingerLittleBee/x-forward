import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import type { Mapper } from '@automapper/types'
import { StreamDto } from './stream.dto'
import { Stream } from './stream.entity'
import { StreamVo } from './stream.vo'

export class StreamProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(Stream, StreamDto)
            mapper.createMap(StreamDto, Stream)
            mapper.createMap(Stream, StreamVo)
            mapper.createMap(StreamVo, Stream)
        }
    }
}
