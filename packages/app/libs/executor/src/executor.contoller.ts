import { ExecutorService } from '@x-forward/executor/services/executor.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller()
export class ExecutorController {
    constructor(private readonly executorService: ExecutorService) {}

    @Post('stream')
    async streamPatch(@Body() newStreamString: string) {
        this.executorService.patchStream(newStreamString)
    }
}
