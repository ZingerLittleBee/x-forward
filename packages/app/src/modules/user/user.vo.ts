import { AutoMap } from '@automapper/classes'
import { PartialType } from '@nestjs/swagger'
import { StateEnum } from 'src/enums/StatusEnum'
import { UserEntity } from './user.entity'

export class UserVo extends PartialType(UserEntity) {
    @AutoMap()
    username: string

    @AutoMap()
    state?: StateEnum

    @AutoMap()
    comment?: string

    @AutoMap()
    createTime?: Date

    @AutoMap()
    updateTime?: Date

    @AutoMap()
    deleteTime?: Date
}
