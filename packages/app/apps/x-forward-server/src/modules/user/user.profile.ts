import type { Mapper } from '@automapper/core'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import { UserEntity } from './user.entity'
import { UserVo } from './user.vo'

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper)
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper.createMap(UserEntity, CreateUserDto)
            mapper.createMap(CreateUserDto, UserEntity)
            mapper.createMap(UserVo, UserEntity)
            mapper.createMap(UserEntity, UserVo)
        }
    }
}
