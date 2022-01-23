import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RenderModule } from '@x-forward/render'
import { EventModule } from '../event/event.module'
import { StreamEntity } from './entity/stream.entity'
import { StreamController } from './stream.controller'
import { StreamProfile } from './stream.profile'
import { StreamService } from './stream.service'

@Module({
    imports: [TypeOrmModule.forFeature([StreamEntity]), RenderModule, EventModule],
    providers: [StreamProfile, StreamService],
    controllers: [StreamController],
    exports: [StreamService]
})
export class StreamModule {}
