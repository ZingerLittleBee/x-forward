import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventEnum, eventThrottle } from '@x-forward/common'

@Injectable()
export class EventService implements OnModuleInit {
    constructor(private eventEmitter: EventEmitter2) {}

    onModuleInit() {
        this.initEvent()
    }

    triggerCreateEvent: () => void
    triggerUpdateEvent: () => void
    triggerDeleteEvent: () => void
    triggerClientPortAdd: () => void
    triggerClientPortRemove: () => void

    private initEvent() {
        this.triggerCreateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_CREATE, 5000)
        this.triggerUpdateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_UPDATE, 5000)
        this.triggerDeleteEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_DELETE, 5000)
        this.triggerClientPortAdd = eventThrottle(this.eventEmitter, EventEnum.CLIENT_PORT_ADD, 5000)
        this.triggerClientPortRemove = eventThrottle(this.eventEmitter, EventEnum.CLIENT_PORT_REMOVE, 5000)
        Logger.log(
            `${EventEnum.CONFIG_CREATE}, ${EventEnum.CONFIG_UPDATE}, ${EventEnum.CONFIG_DELETE}, ${EventEnum.CLIENT_PORT_ADD}, ${EventEnum.CLIENT_PORT_REMOVE} registered`
        )
    }
}
