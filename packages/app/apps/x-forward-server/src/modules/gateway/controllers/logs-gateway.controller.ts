import { Controller, Logger } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Result } from '@x-forward/common'
import { inspect } from 'util'
import { LogsGatewayService } from '../services/logs-gateway.service'

@Controller()
export class LogsGatewayController {
    constructor(private readonly logsGatewayService: LogsGatewayService) {}

    @GrpcMethod('ReportService')
    async getLastTime({ id }: { id: string }) {
        Logger.verbose(`clientId: ${inspect(id)}, request getLastTime`)
        return Result.okData(await this.logsGatewayService.getLastTimeByClientId(id))
    }
}
