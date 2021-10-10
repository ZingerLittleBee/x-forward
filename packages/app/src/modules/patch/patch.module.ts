import { CacheModule, Module } from '@nestjs/common'
import { EnvEnum } from 'src/enums/EnvEnum'
import { ExecutorModule } from '../executor/executor.module'
import { PatchApi } from './patch.api'
import { PatchService } from './patch.service'

@Module({
    imports: [
        CacheModule.register(),
        ExecutorModule.register(process.env[EnvEnum.EFFECTED_NGINX])
    ],
    providers: [PatchService, PatchApi],
    exports: [PatchApi]
})
export class PatchModule {}
