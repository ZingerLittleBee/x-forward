import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ExecutorEndPoint } from '@x-forward/common/constants/endpoint.constant'
import { ExecutorService } from '@x-forward/executor/services/executor.service'

@ApiTags(ExecutorEndPoint.EXECUTOR)
@Controller()
export class ExecutorController {
    constructor(private readonly executorService: ExecutorService) {}

    @Get()
    async getNginxStatus() {
        return this.executorService.queryNginxStatus()
    }

    @Get()
    async getSystemInfo() {
        return this.executorService.getSystemInfo()
    }

    @Post(ExecutorEndPoint.STREAM_PATCH)
    async streamPatch(@Body() newStreamString: string) {
        this.executorService.patchStream(newStreamString)
    }
}
