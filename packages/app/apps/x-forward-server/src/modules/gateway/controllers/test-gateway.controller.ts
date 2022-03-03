import { Controller, Get } from '@nestjs/common'
import { ExecutorGatewayService } from '../services/executor-gateway.service'

@Controller()
export class TestGatewayController {
    constructor(private readonly executorGatewayService: ExecutorGatewayService) {}

    @Get('bin')
    getNginxBin() {
        return this.executorGatewayService.getNginxBin('')
    }
}
