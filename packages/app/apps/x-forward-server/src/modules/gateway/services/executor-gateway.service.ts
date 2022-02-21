import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { RenderService } from '@x-forward/render'
import { ExecutorGatewayApi } from '../interface/gateway.interface'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(private renderService: RenderService, private readonly httpService: HttpService) {}

    streamPatch(url: string, content: string) {
        this.httpService.post(url, content).subscribe({
            error: err => Logger.warn(`POST ${url} with body:\n${content}\noccurred error: ${err}`)
        })
    }
}
