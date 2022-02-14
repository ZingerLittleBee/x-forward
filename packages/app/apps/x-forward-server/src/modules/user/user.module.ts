import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserProfile } from './user.profile'
import { UserService } from './user.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, UserProfile],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
