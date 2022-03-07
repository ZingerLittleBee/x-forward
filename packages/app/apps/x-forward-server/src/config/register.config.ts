import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'
import { ServerEntity } from '../modules/server/entity/server.entity'
import { StreamEntity } from '../modules/stream/entity/stream.entity'
import { UpstreamEntity } from '../modules/upstream/entity/upstream.entity'
import { UserEntity } from '../modules/user/user.entity'

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

export const MongoRegister = () => {
    return MongooseModule.forRootAsync({
        useFactory: () => {
            return {
                uri: getEnvSetting(EnvKeyEnum.MongoUri)
            }
        }
    })
}

export const CacheRegister = () => CacheModule.register({ ttl: 0 })

export const HttpRegister = (args?: Record<string, any>) =>
    HttpModule.register({
        ...args,
        timeout: 5000,
        maxRedirects: 5
    })
