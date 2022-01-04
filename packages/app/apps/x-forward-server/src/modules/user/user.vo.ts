import { AutoMap } from '@automapper/classes'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { StateEnum } from '@x-forward/common'
import { UserEntity } from './user.entity'

export class UserVo extends PartialType(UserEntity) {
    @ApiProperty()
    @AutoMap()
    username: string

    @ApiProperty()
    @AutoMap()
    state?: StateEnum

    @ApiProperty()
    @AutoMap()
    comment?: string

    @ApiProperty()
    @AutoMap()
    createTime?: Date

    @ApiProperty()
    @AutoMap()
    updateTime?: Date

    @ApiProperty()
    @AutoMap()
    deleteTime?: Date
}
