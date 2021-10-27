import { CacheModule, Module } from '@nestjs/common'
import { GatewayModule } from '../gateway/gateway.module'
import { PatchApi } from './patch.api'
import { PatchService } from './patch.service'

@Module({
    imports: [CacheModule.register(), GatewayModule],
    providers: [PatchService, PatchApi],
    exports: [PatchApi]
})
export class PatchModule {}
