import { OmitType } from '@nestjs/swagger'
import { UserEntity } from './user.entity'

export class UserVo extends OmitType(UserEntity, ['password']) {}
