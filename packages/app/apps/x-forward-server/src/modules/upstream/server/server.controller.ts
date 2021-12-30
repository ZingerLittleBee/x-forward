import { Result } from '@app/x-forward-common'
import { MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Param, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from '../../../decorators/response.api'
import { UpdateServerDto } from './dto/update-server.dto'
import { ServerEntity } from './entities/server.entity'
import { ServerService } from './server.service'

@ApiTags('server')
@Controller('server')
export class ServerController {
    constructor(private serverService: ServerService) {}

    @Patch(':id')
    @ApiResultResponse('number')
    async patch(@Param() id: string, @Body(MapPipe(ServerEntity, UpdateServerDto)) server: UpdateServerDto) {
        return Result.okData((await this.serverService.update(id, server as ServerEntity)).affected)
    }

    @Delete(':id')
    @ApiResultResponse('number')
    async remove(@Param() id: string) {
        return Result.okData((await this.serverService.remove(id)).affected)
    }
}
