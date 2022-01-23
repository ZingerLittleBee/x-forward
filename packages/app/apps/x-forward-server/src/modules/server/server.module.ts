import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventModule } from '../event/event.module'
import { ServerEntity } from './entity/server.entity'
import { ServerController } from './server.controller'
import { ServerProfile } from './server.profile'
import { ServerService } from './server.service'

@Module({
    imports: [TypeOrmModule.forFeature([ServerEntity]), EventModule],
    controllers: [ServerController],
    providers: [ServerService, ServerProfile],
    exports: [ServerService, ServerProfile]
})
export class ServerModule {}
