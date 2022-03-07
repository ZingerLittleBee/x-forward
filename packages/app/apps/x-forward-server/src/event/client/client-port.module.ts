import { Module } from '@nestjs/common'
import { GatewayModule } from '../../modules/gateway/gateway.module'
import { ClientPortListener } from './client-port.listener'

@Module({
    imports: [GatewayModule],
    providers: [ClientPortListener]
})
export class ClientPortModule {}
