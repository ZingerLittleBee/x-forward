import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PatchModule } from '../patch/patch.module'
import { StreamController } from './stream.controller'
import { Stream } from './stream.entity'
import { StreamProfile } from './stream.profile'
import { StreamService } from './stream.service'

@Module({
    imports: [TypeOrmModule.forFeature([Stream]), PatchModule],
    providers: [StreamProfile, StreamService],
    controllers: [StreamController]
})
export class StreamModule {}
