import { CacheModule, Module } from '@nestjs/common'
import { PatchApi } from './patch.api'
import { PatchService } from './patch.service'

@Module({
    imports: [
        CacheModule.register(),
    ],
    providers: [PatchService, PatchApi],
    exports: [PatchApi]
})
export class PatchModule {}
