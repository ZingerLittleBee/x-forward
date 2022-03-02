import { Controller, Get, Param, Query } from '@nestjs/common'
import { LogsEndPoint } from '@x-forward/common'
import { LogsService } from './logs.service'

@Controller(LogsEndPoint.LOGS)
export class LogsController {
    constructor(private readonly logService: LogsService) {}

    @Get(`${LogsEndPoint.TRAFFIC}/:userId`)
    queryTraffic(
        @Param('userId') userId: string,
        @Query('clientId') clientId: string,
        @Query('startTime') startTime: Date,
        @Query('endTime') endTime: Date
    ) {
        return clientId
            ? this.logService.getTrafficByClientId(userId, clientId, startTime, endTime)
            : this.logService.getTraffic(userId, startTime, endTime)
    }
}
