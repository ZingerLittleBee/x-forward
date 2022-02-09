import { Module } from '@nestjs/common'
import { ClientService } from './client.service'
import { ClientController } from './client.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity } from './entity/client.entity'
import { ClientProfile } from './client.profile'

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity])],
    providers: [ClientProfile, ClientService],
    controllers: [ClientController]
})
export class ClientModule {}
