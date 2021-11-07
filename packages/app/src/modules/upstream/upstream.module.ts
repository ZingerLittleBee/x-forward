import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StreamModule } from '../stream/stream.module'
import { ServerModule } from './server/server.module'
import { UpstreamController } from './upstream.controller'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamProfile } from './upstream.profile'
import { UpstreamService } from './upstream.service'

@Module({
    imports: [TypeOrmModule.forFeature([UpstreamEntity]), ServerModule, StreamModule],
    controllers: [UpstreamController],
    providers: [UpstreamService, UpstreamProfile],
    exports: [UpstreamService]
})
export class UpstreamModule {}
