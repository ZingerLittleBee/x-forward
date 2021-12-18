import { PickType } from '@nestjs/swagger'
import { UserEntity } from './user.entity'

export class CreateUserDto extends PickType(UserEntity, ['username', 'password', 'state', 'comment']) {}

export class LoginUserDto extends PickType(UserEntity, ['username', 'password']) {}
