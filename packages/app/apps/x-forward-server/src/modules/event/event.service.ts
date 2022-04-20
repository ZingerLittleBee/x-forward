import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { eventDebounce, EventEnum } from '@x-forward/common'
import { ClientPortAddDto, ClientPortRemoveDto } from '../../event/client/client-port.dto'
import { ConfigChangePayload } from './config-change.interface'

@Injectable()
export class EventService implements OnModuleInit {
    constructor(private eventEmitter: EventEmitter2) {
        this.debounceTime = 5000
    }

    debounceTime: number

    onModuleInit() {
        this.initEvent()
    }

    triggerCreateEvent: (payload: ConfigChangePayload) => void
    triggerUpdateEvent: (payload: ConfigChangePayload) => void
    triggerDeleteEvent: (payload: ConfigChangePayload) => void
    triggerBatchStart: (payload: ConfigChangePayload) => void
    triggerBatchRestart: (payload: ConfigChangePayload) => void
    triggerBatchStop: (payload: ConfigChangePayload) => void
    triggerBatchDelete: (payload: ConfigChangePayload) => void
    triggerClientPortAdd: (payload: ClientPortAddDto) => void
    triggerClientPortRemove: (payload: ClientPortRemoveDto) => void

    private initEvent() {
        this.triggerCreateEvent = eventDebounce(this.eventEmitter, EventEnum.CONFIG_CREATE, this.debounceTime)
        this.triggerUpdateEvent = eventDebounce(this.eventEmitter, EventEnum.CONFIG_UPDATE, this.debounceTime)
        this.triggerDeleteEvent = eventDebounce(this.eventEmitter, EventEnum.CONFIG_DELETE, this.debounceTime)
        this.triggerBatchStart = eventDebounce(this.eventEmitter, EventEnum.CONFIG_BATCH_START, this.debounceTime)
        this.triggerBatchRestart = eventDebounce(this.eventEmitter, EventEnum.CONFIG_BATCH_RESTART, this.debounceTime)
        this.triggerBatchStop = eventDebounce(this.eventEmitter, EventEnum.CONFIG_BATCH_STOP, this.debounceTime)
        this.triggerBatchDelete = eventDebounce(this.eventEmitter, EventEnum.CONFIG_BATCH_DELETE, this.debounceTime)
        this.triggerClientPortAdd = eventDebounce(this.eventEmitter, EventEnum.CLIENT_PORT_ADD, this.debounceTime)
        this.triggerClientPortRemove = eventDebounce(this.eventEmitter, EventEnum.CLIENT_PORT_REMOVE, this.debounceTime)
        Logger.log(
            `${EventEnum.CONFIG_CREATE}, ${EventEnum.CONFIG_UPDATE}, ${EventEnum.CONFIG_DELETE}, ${EventEnum.CONFIG_BATCH_START}, ${EventEnum.CONFIG_BATCH_RESTART}, ${EventEnum.CONFIG_BATCH_STOP}, ${EventEnum.CONFIG_BATCH_DELETE}, ${EventEnum.CLIENT_PORT_ADD}, ${EventEnum.CLIENT_PORT_REMOVE} registered`
        )
    }
}
