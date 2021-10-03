import { CacheModule, Module } from '@nestjs/common'
import { EnvController } from './env.controller'
import { EnvService } from './env.service'

@Module({
    imports: [CacheModule.register()],
    controllers: [EnvController],
    providers: [EnvService]
})
export class EnvModule {}
