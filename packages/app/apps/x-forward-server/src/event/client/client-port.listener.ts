import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'
import { ClientPortAddDto, ClientPortRemoveDto } from './client-port.dto'

@Injectable()
export class ClientPortListener {
    constructor(private readonly httpService: HttpService) {}

    @OnEvent(EventEnum.CLIENT_PORT_ADD)
    async handleClientPortAdd(payload: ClientPortAddDto) {
        console.log('payload', payload)
        this.httpService.post('')
    }

    @OnEvent(EventEnum.CLIENT_PORT_REMOVE)
    async handleClientPortRemove(payload: ClientPortRemoveDto) {
        console.log('payload', payload)
        this.httpService.post('')
    }
}
