import { AutoMap } from '@automapper/classes'
import { PartialType } from '@nestjs/swagger'
import { StateEnum } from 'src/enums/StatusEnum'
import { UserEntity } from './user.entity'

export class CreateUserDto extends PartialType(UserEntity) {
    @AutoMap()
    username: string

    @AutoMap()
    password: string

    @AutoMap()
    state?: StateEnum

    @AutoMap()
    comment?: string
}

export class LoginUserDto extends PartialType(UserEntity) {
    @AutoMap()
    username: string

    @AutoMap()
    password: string
}
