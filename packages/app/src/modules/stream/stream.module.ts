import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RenderModule } from '../render/render.module'
import { StreamController } from './stream.controller'
import { StreamEntity } from './stream.entity'
import { StreamProfile } from './stream.profile'
import { StreamService } from './stream.service'

@Module({
    imports: [TypeOrmModule.forFeature([StreamEntity]), RenderModule],
    providers: [StreamProfile, StreamService],
    controllers: [StreamController],
    exports: [StreamService]
})
export class StreamModule {}
