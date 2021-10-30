import { MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Param, Patch } from '@nestjs/common'
import { Result } from 'src/utils/Result'
import { UpdateServerDto } from './dto/update-server.dto'
import { ServerEntity } from './entities/server.entity'
import { ServerService } from './server.service'

@Controller('server')
export class ServerController {
    constructor(private serverService: ServerService) {}

    @Patch(':id')
    async patch(@Param() id: string, @Body(MapPipe(ServerEntity, UpdateServerDto)) server: UpdateServerDto) {
        return Result.okData((await this.serverService.update(id, server as ServerEntity)).affected)
    }

    @Delete(':id')
    async remove(@Param() id: string) {
        return Result.okData((await this.serverService.remove(id)).affected)
    }
}
