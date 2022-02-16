import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientController } from './client.controller'
import { ClientProfile } from './client.profile'
import { ClientService } from './client.service'
import { ClientEntity } from './entity/client.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity])],
    providers: [ClientProfile, ClientService],
    controllers: [ClientController]
})
export class ClientModule {}
