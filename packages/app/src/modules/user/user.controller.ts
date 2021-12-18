import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from 'src/decorators/response.api'
import { IResult } from 'src/interface/result.interface'
import { Result } from 'src/utils/Result'
import { CreateUserDto, LoginUserDto } from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserVo } from './user.vo'

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @ApiExtraModels(UserVo, Result, UserEntity)
    @ApiResultResponse(UserVo, { isArray: true })
    @UseInterceptors(MapInterceptor(UserVo, UserEntity, { isArray: true }))
    async getAll() {
        return Result.okData(await this.userService.findAll())
    }

    @Post('/login')
    @ApiResultResponse()
    async login(@Body() user: LoginUserDto): Promise<IResult<any>> {
        return (await this.userService.login(user)) ? Result.okMsg('登录成功') : Result.noWithMsg('用户名或者密码错误')
    }

    @Post('')
    @ApiResultResponse(UserEntity)
    @UseInterceptors(MapInterceptor(UserVo, UserEntity))
    async createUser(@Body(MapPipe(UserEntity, CreateUserDto)) user: CreateUserDto): Promise<IResult<UserEntity>> {
        return new Result<UserEntity>().okWithData(await this.userService.create(user as UserEntity))
    }

    @Delete(':id')
    @ApiResultResponse('number')
    async delete(@Param('id') id: string): Promise<IResult<number>> {
        return new Result<number>().okWithData(await this.userService.delete(id))
    }
}
