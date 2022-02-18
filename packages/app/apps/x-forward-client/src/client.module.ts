import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExecutorModule } from '@x-forward/executor'
import { LogsModule } from './modules/logs/logs.module'
import { RegisterModule } from './modules/register/register.module'

@Module({
    imports: [
        CacheModule.register({ ttl: 0 }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ExecutorModule,
        RegisterModule,
        LogsModule
    ],
    controllers: [],
    providers: []
})
export class ClientModule {}
