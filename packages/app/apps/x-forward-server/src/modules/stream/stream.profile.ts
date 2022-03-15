import type { Mapper } from '@automapper/core'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { Injectable } from '@nestjs/common'
import { CreateStreamDto } from './dto/create-stream.dto'
import { StreamDto } from './dto/stream.dto'
import { StreamEntity } from './entity/stream.entity'
import { StreamVo } from './vo/stream.vo'

@Injectable()
export class StreamProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(StreamEntity, StreamVo)
            mapper.createMap(StreamVo, StreamEntity)
            mapper.createMap(StreamEntity, StreamDto)
            mapper.createMap(StreamDto, StreamEntity)
            mapper.createMap(CreateStreamDto, StreamEntity)
            mapper.createMap(StreamEntity, CreateStreamDto)
        }
    }
}
