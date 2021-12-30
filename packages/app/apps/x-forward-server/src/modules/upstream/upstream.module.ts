import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventModule } from '../event/event.module'
import { StreamModule } from '../stream/stream.module'
import { ServerModule } from './server/server.module'
import { UpstreamController } from './upstream.controller'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamProfile } from './upstream.profile'
import { UpstreamService } from './upstream.service'

@Module({
    imports: [TypeOrmModule.forFeature([UpstreamEntity]), ServerModule, StreamModule, EventModule],
    controllers: [UpstreamController],
    providers: [UpstreamService, UpstreamProfile],
    exports: [UpstreamService]
})
export class UpstreamModule {}
