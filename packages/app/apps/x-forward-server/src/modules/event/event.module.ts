import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { EventEmitterRegister } from '../../config/register.config'

@Module({
    imports: [EventEmitterRegister()],
    providers: [EventService],
    exports: [EventService]
})
export class EventModule {}
