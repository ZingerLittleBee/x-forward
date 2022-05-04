import { Controller, Logger } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Result } from '@x-forward/common'
import { GrpcEndPoint } from '@x-forward/common/constants/endpoint.constant'
import { ExecutorService } from '@x-forward/executor/services/executor.service'
@Controller()
export class ExecutorController {
    constructor(private readonly executorService: ExecutorService) {}

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getNginxBin() {
        return Result.okData(await this.executorService.getNginxBin())
    }

    /**
     * getNginxConfigArgs
     * args as sting
     * @returns GrpcNginxConfig
     */
    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getNginxConfigArgs() {
        const configArgs = await this.executorService.getNginxConfigArgs()
        return Result.okData({
            ...configArgs,
            args: JSON.stringify(configArgs?.args)
        })
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getNginxStreamConfigContent() {
        return Result.okData(await this.executorService.getNginxStreamConfigContent())
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async rewriteMainConfig(args: { content: string }) {
        return Result.okData(await this.executorService.rewriteMainConfig(args?.content))
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async fetchDirectory(args: { url: string }) {
        return Result.okData(await this.executorService.getDirByUrl(args?.url))
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getNginxStatus() {
        return Result.okData(await this.executorService.queryNginxStatus())
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getSystemInfo() {
        return Result.okData(await this.executorService.getSystemInfo())
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async getSystemTime() {
        return Result.okData(await this.executorService.getSystemTime())
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async streamPatch(args: { content: string }) {
        try {
            this.executorService.patchStream(args?.content)
        } catch (e) {
            return Result.noWithMsg(e)
        }
        return Result.ok()
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async rewriteStream(args: { content: string }) {
        try {
            this.executorService.rewriteStream(args?.content)
        } catch (e) {
            return Result.noWithMsg(e)
        }
        return Result.ok()
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async nginxStart() {
        this.executorService.nginxStart()
        return Result.ok()
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async nginxStop() {
        this.executorService.nginxStop()
        return Result.ok()
    }

    @GrpcMethod(GrpcEndPoint.EXECUTOR_SERVICE)
    async nginxRestart() {
        Logger.verbose(`received nginxRestart by grpc`)
        this.executorService.nginxRestart()
        return Result.ok()
    }
}
