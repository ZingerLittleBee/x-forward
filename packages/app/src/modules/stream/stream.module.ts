import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventModule } from '../event/event.module'
import { RenderModule } from '../render/render.module'
import { StreamController } from './stream.controller'
import { StreamEntity } from './stream.entity'
import { StreamProfile } from './stream.profile'
import { StreamService } from './stream.service'

@Module({
    imports: [TypeOrmModule.forFeature([StreamEntity]), RenderModule, EventModule],
    providers: [StreamProfile, StreamService],
    controllers: [StreamController],
    exports: [StreamService]
})
export class StreamModule {}
