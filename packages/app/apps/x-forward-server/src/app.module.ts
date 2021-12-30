import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AutomapperRegister, EventEmitterRegister, TypeOrmRegister } from './config/register.config'
import { ConfigChangeModule } from './event/config/config-change.module'
import { EnvModule } from './modules/env/env.module'
import { GatewayModule } from './modules/gateway/gateway.module'
import { ShellModule } from './modules/shell/shell.module'
import { StreamModule } from './modules/stream/stream.module'
import { ServerModule } from './modules/upstream/server/server.module'
import { UpstreamModule } from './modules/upstream/upstream.module'
import { UserModule } from './modules/user/user.module'

@Module({
    imports: [
        TypeOrmRegister(),
        AutomapperRegister(),
        EventEmitterRegister(),
        ConfigModule.forRoot(),
        CacheModule.register(),
        ConfigChangeModule,
        ShellModule,
        UserModule,
        EnvModule,
        ShellModule,
        StreamModule,
        GatewayModule,
        UpstreamModule,
        ServerModule
    ]
})
export class AppModule {}
