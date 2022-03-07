import { Body, Controller, Post } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Result } from '@x-forward/common'
import { ExecutorEndPoint } from '@x-forward/common/constants/endpoint.constant'
import { ExecutorService } from '@x-forward/executor/services/executor.service'
@Controller()
export class ExecutorController {
    constructor(private readonly executorService: ExecutorService) {}

    @GrpcMethod('ExecutorService')
    async getNginxBin() {
        return Result.okData(await this.executorService.getNginxBin())
    }

    /**
     * getNginxConfigArgs
     * args as sting
     * @returns GrpcNginxConfig
     */
    @GrpcMethod('ExecutorService')
    async getNginxConfigArgs() {
        const configArgs = await this.executorService.getNginxConfigArgs()
        return Result.okData({
            ...configArgs,
            args: JSON.stringify(configArgs?.args)
        })
    }

    @GrpcMethod('ExecutorService')
    async getNginxStreamConfigContent() {
        return Result.okData(await this.executorService.getNginxStreamConfigContent())
    }

    @GrpcMethod('ExecutorService')
    async rewriteMainConfig(args: { content: string }) {
        return Result.okData(await this.executorService.rewriteMainConfig(args?.content))
    }

    @GrpcMethod('ExecutorService')
    async fetchDirectory(args: { url: string }) {
        return Result.okData(await this.executorService.getDirByUrl(args?.url))
    }

    @GrpcMethod('ExecutorService')
    async getNginxStatus() {
        return Result.okData(await this.executorService.queryNginxStatus())
    }

    @GrpcMethod('ExecutorService')
    async getSystemInfo() {
        return Result.okData(await this.executorService.getSystemInfo())
    }

    @Post(ExecutorEndPoint.STREAM_PATCH)
    async streamPatch(@Body() newStreamString: string) {
        this.executorService.patchStream(newStreamString)
    }
}
