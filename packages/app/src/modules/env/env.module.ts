import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvEnum } from 'src/enums/EnvEnum'
import { ExecutorModule } from '../executor/executor.module'
import { PatchModule } from '../patch/patch.module'
import { EnvController } from './env.controller'
import { EnvService } from './env.service'

@Module({
    imports: [
        CacheModule.register(),
        ConfigModule.forRoot(),
        PatchModule,
        ExecutorModule.register(process.env[EnvEnum.EFFECTED_NGINX])
    ],
    controllers: [EnvController],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule {}
