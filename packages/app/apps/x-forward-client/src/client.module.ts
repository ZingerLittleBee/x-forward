import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LogsModule } from './modules/logs/logs.module'
import { RegisterModule } from './modules/register/register.module'

@Module({
    imports: [
        CacheModule.register({ ttl: 0 }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        RegisterModule,
        LogsModule
    ],
    controllers: [],
    providers: []
})
export class ClientModule {}
