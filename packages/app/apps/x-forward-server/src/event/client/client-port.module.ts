import { Module } from '@nestjs/common'
import { HttpRegister } from '../../config/register.config'
import { ClientPortListener } from './client-port.listener'

@Module({
    imports: [HttpRegister()],
    providers: [ClientPortListener]
})
export class ClientPortModule {}
