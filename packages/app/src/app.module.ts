import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigChangeModule } from './event/config/config-change.module'
import { EnvModule } from './modules/env/env.module'
import { GatewayModule } from './modules/gateway/gateway.module'
import { ShellModule } from './modules/shell/shell.module'
import { StreamEntity } from './modules/stream/stream.entity'
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
            entities: [User, StreamEntity, UpstreamEntity, ServerEntity],
            autoLoadEntities: true,
            synchronize: true,
            logging: true
        }),
        AutomapperModule.forRoot({
            options: [{ name: 'blah', pluginInitializer: classes }],
            singular: true
        }),
        EventEmitterModule.forRoot({
            // set this to `true` to use wildcards
            wildcard: false,
            // the delimiter used to segment namespaces
            delimiter: '.',
            // set this to `true` if you want to emit the newListener event
            newListener: false,
            // set this to `true` if you want to emit the removeListener event
            removeListener: false,
            // the maximum amount of listeners that can be assigned to an event
            maxListeners: 10,
            // show event name in memory leak message when more than maximum amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted and it has no listeners
            ignoreErrors: false
        }),
        ConfigModule.forRoot(),
        CacheModule.register(),
        ConfigChangeModule,
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
