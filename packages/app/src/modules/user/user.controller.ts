import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { Result } from 'src/utils/Result'
import { CreateUserDto, LoginUserDto } from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserVo } from './user.vo'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @UseInterceptors(MapInterceptor(UserVo, UserEntity, { isArray: true }))
    async getAll() {
        return Result.okData(await this.userService.findAll())
    }

    @Post('/login')
    async login(@Body() user: LoginUserDto) {
        return (await this.userService.login(user)) ? Result.okMsg('登录成功') : Result.noWithMsg('用户名或者密码错误')
    }

    @Post('')
    @UseInterceptors(MapInterceptor(UserVo, UserEntity))
    async createUser(@Body(MapPipe(UserEntity, CreateUserDto)) user: CreateUserDto) {
        return Result.okData(await this.userService.create(user as UserEntity))
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return Result.okData(await this.userService.delete(id))
    }
}
