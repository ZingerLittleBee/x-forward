import { Controller, Logger } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Result } from '@x-forward/common'
import { isArray } from 'lodash'
import { inspect } from 'util'
import { LogsDto } from '../dtos/logs.dto'
import { LogsGatewayService } from '../services/logs-gateway.service'

@Controller()
export class LogsGatewayController {
    constructor(private readonly logsGatewayService: LogsGatewayService) {}

    @GrpcMethod('ReportService')
    async getLastTime({ id }: { id: string }) {
        Logger.verbose(`clientId: ${inspect(id)}, request getLastTime`)
        return Result.okData(await this.logsGatewayService.getLastTimeByClientId(id))
    }

    @GrpcMethod('ReportService')
    async LogReport({ logs }: { logs: LogsDto[] }) {
        Logger.verbose(`receive logs: ${inspect(logs)}`)
        const insertLogs = await this.logsGatewayService.addLogs(logs)
        if (isArray(insertLogs) && insertLogs.length > 0) {
            return Result.ok()
        }
        return Result.no()
    }
}
