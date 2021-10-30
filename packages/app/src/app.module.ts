import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from './modules/env/env.module'
import { GatewayModule } from './modules/gateway/gateway.module'
import { ShellModule } from './modules/shell/shell.module'
import { Stream } from './modules/stream/stream.entity'
import { StreamModule } from './modules/stream/stream.module'
import { ServerEntity } from './modules/upstream/server/entities/server.entity'
import { ServerModule } from './modules/upstream/server/server.module'
import { UpstreamEntity } from './modules/upstream/upstream.entity'
import { UpstreamModule } from './modules/upstream/upstream.module'
import { User } from './modules/user/user.entity'
import { UserModule } from './modules/user/user.module'
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: './x-forward.db',
            // to solve pkg which can not find entity in ormconfig.json
            entities: [User, Stream, UpstreamEntity, ServerEntity],
            autoLoadEntities: true,
            synchronize: true,
            logging: true
        }),
        AutomapperModule.forRoot({
            options: [{ name: 'blah', pluginInitializer: classes }],
            singular: true
        }),
        ConfigModule.forRoot(),
        CacheModule.register(),
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
