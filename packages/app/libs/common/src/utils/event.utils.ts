import { EventEmitter2 } from '@nestjs/event-emitter'
import { debounce } from 'lodash'

export const eventDebounce = <T>(eventEmitter: EventEmitter2, eventName: string, delay = 1000) => {
    return debounce((data?: T) => {
        eventEmitter.emit(eventName, data)
    }, delay)
}
