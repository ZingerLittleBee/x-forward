import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AutomapperRegister, EventEmitterRegister, MongoRegister, TypeOrmRegister } from './config/register.config'
import { ConfigChangeModule } from './event/config/config-change.module'
import { EnvModule } from './modules/env/env.module'
import { GatewayModule } from './modules/gateway/gateway.module'
import { LogsModule } from './modules/logs/logs.module'
import { ServerModule } from './modules/server/server.module'
import { ShellModule } from './modules/shell/shell.module'
import { StreamModule } from './modules/stream/stream.module'
import { UpstreamModule } from './modules/upstream/upstream.module'
import { UsageModule } from './modules/usage/usage.module'
import { UserModule } from './modules/user/user.module'
import { ScheduleModule } from '@nestjs/schedule'
import { ClientModule } from './modules/client/client.module'
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmRegister(),
        MongoRegister(),
        AutomapperRegister(),
        EventEmitterRegister(),
        CacheModule.register(),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        ConfigChangeModule,
        ShellModule,
        UserModule,
        EnvModule,
        ShellModule,
        StreamModule,
        GatewayModule,
        UpstreamModule,
        ServerModule,
        LogsModule,
        UsageModule,
        ClientModule,
        AuthModule
    ]
})
export class AppModule {}
