import { Injectable } from '@nestjs/common'
import { LogsService } from '../../logs/logs.service'

@Injectable()
export class LogsGatewayService {
    constructor(private readonly logsService: LogsService) {}

    async getLastTimeByClientId(clientId: string) {
        return this.logsService.getLastTimeByClientId(clientId)
    }
}
