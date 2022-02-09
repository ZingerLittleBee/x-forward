import { LogsService } from './logs.service'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'
import { Controller } from '@nestjs/common'

@Controller('logs')
export class LogsController {
    constructor(private readonly logService: LogsService) {}

    async create(createLogDto: CreateLogDto) {
        return this.logService.add(createLogDto)
    }
}
