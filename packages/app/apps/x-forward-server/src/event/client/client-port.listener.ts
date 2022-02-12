import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'

@Injectable()
export class ClientPortListener {
    constructor(private readonly httpService: HttpService) {}

    @OnEvent(EventEnum.CLIENT_PORT_ADD)
    async handleClientPortAdd() {
        this.httpService.post('')
    }
}
