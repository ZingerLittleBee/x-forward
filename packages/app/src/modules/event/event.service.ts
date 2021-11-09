import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventEnum } from 'src/enums/event.enum'
import { eventThrottle } from 'src/utils/event.util'

@Injectable()
export class EventService implements OnModuleInit {
    constructor(private eventEmitter: EventEmitter2) {}

    onModuleInit() {
        this.initEvent()
    }

    triggerCreateEvent: Function
    triggerUpdateEvent: Function
    triggerDeleteEvent: Function

    private initEvent() {
        this.triggerCreateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_CREATE, 5000)
        this.triggerUpdateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_UPDATE, 5000)
        this.triggerCreateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_DELETE, 5000)
        Logger.verbose(`${EventEnum.CONFIG_CREATE}, ${EventEnum.CONFIG_UPDATE}, ${EventEnum.CONFIG_DELETE} registered`)
    }
}
