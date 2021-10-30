import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServerModule } from './server/server.module'
import { UpstreamController } from './upstream.controller'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamProfile } from './upstream.profile'
import { UpstreamService } from './upstream.service'

@Module({
    imports: [TypeOrmModule.forFeature([UpstreamEntity]), ServerModule],
    controllers: [UpstreamController],
    providers: [UpstreamService, UpstreamProfile]
})
export class UpstreamModule {}
