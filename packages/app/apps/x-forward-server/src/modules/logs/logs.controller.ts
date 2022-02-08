import { LogService } from './log.service'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'

export class LogsController {
    constructor(private readonly logService: LogService) {}

    async create(createLogDto: CreateLogDto) {
        return this.logService.add(createLogDto)
    }
}
