import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ExecutorModule } from '@x-forward/executor'
import { GrpcHelperModule } from './modules/grpc-helper/grpc-helper.module'
import { LogsModule } from './modules/logs/logs.module'
import { RegisterModule } from './modules/register/register.module'

@Module({
    imports: [
        CacheModule.register({ ttl: 0 }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        GrpcHelperModule,
        ExecutorModule,
        RegisterModule,
        LogsModule
    ],
    controllers: [],
    providers: []
})
export class ClientModule {}
