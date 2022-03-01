import { Injectable } from '@nestjs/common'
import { Log } from '@x-forward/bucket/schemas/log.schema'
import { LogsService } from '../../logs/logs.service'
import { LogsDto } from '../dtos/logs.dto'

@Injectable()
export class LogsGatewayService {
    constructor(private readonly logsService: LogsService) {}

    async getLastTimeByClientId(clientId: string) {
        return this.logsService.getLastTimeByClientId(clientId)
    }

    async addLogs(logs: LogsDto[]): Promise<Log | Log[]> {
        return this.logsService.add(logs)
    }
}
