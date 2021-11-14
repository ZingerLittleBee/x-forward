import { MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Param, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from 'src/decorators/response.api'
import { Result } from 'src/utils/Result'
import { UpdateServerDto } from './dto/update-server.dto'
import { ServerEntity } from './entities/server.entity'
import { ServerService } from './server.service'

@ApiTags('server')
@Controller('server')
export class ServerController {
    constructor(private serverService: ServerService) {}

    @Patch(':id')
    @ApiResultResponse(Number)
    async patch(@Param() id: string, @Body(MapPipe(ServerEntity, UpdateServerDto)) server: UpdateServerDto) {
        return Result.okData((await this.serverService.update(id, server as ServerEntity)).affected)
    }

    @Delete(':id')
    @ApiResultResponse(Number)
    async remove(@Param() id: string) {
        return Result.okData((await this.serverService.remove(id)).affected)
    }
}
