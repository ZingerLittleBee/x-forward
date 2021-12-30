import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../modules/user/user.entity'
import { StreamEntity } from '../modules/stream/stream.entity'
import { UpstreamEntity } from '../modules/upstream/upstream.entity'
import { ServerEntity } from '../modules/upstream/server/entities/server.entity'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { CacheModule } from '@nestjs/common'

export const EventEmitterRegister = () =>
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
    })

export const TypeOrmRegister = () =>
    TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: `${process.cwd()}/x-forward.db`,
        // to solve pkg which can not find entity in ormconfig.json
        entities: [UserEntity, StreamEntity, UpstreamEntity, ServerEntity],
        autoLoadEntities: true,
        synchronize: true,
        logging: true
    })

export const AutomapperRegister = () =>
    AutomapperModule.forRoot({
        options: [{ name: 'blah', pluginInitializer: classes }],
        singular: true
    })

export const CacheRegister = () => CacheModule.register({ ttl: 0 })
