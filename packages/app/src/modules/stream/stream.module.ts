import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PatchModule } from '../patch/patch.module'
import { StreamController } from './stream.controller'
import { Stream } from './stream.entity'
import { StreamService } from './stream.service'

@Module({
    imports: [TypeOrmModule.forFeature([Stream]), PatchModule],
    providers: [StreamService],
    controllers: [StreamController]
})
export class StreamModule {}
