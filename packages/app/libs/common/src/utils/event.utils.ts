import { EventEmitter2 } from '@nestjs/event-emitter'
import { throttle } from 'lodash'

export const eventThrottle = <T>(eventEmitter: EventEmitter2, eventName: string, delay = 1000) => {
    return throttle((data?: T) => {
        eventEmitter.emit(eventName, data)
    }, delay)
}
