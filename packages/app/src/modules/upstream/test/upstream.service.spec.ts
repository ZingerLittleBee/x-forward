import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { EventModule } from 'src/modules/event/event.module'
import { StreamModule } from 'src/modules/stream/stream.module'
import { Repository } from 'typeorm'
import { ServerEntity } from '../server/entities/server.entity'
import { ServerModule } from '../server/server.module'
import { UpstreamController } from '../upstream.controller'
import { UpstreamEntity } from '../upstream.entity'
import { UpstreamProfile } from '../upstream.profile'
import { UpstreamService } from '../upstream.service'

describe('UpstreamService', () => {
    let upstreamService: UpstreamService
    let repository: Repository<UpstreamEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
                    database: '../../../../x-forward.db',
                    entities: [UpstreamEntity, ServerEntity],
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true,
                    keepConnectionAlive: true
                }),
                TypeOrmModule.forFeature([UpstreamEntity]),
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
                ServerModule,
                StreamModule,
                EventModule
            ],
            controllers: [UpstreamController],
            providers: [UpstreamService, UpstreamProfile]
        }).compile()
        await moduleRef.init()
        repository = moduleRef.get<Repository<UpstreamEntity>>(getRepositoryToken(UpstreamEntity))
        upstreamService = moduleRef.get<UpstreamService>(UpstreamService)
    })

    afterEach(() => {
        repository.clear()
    })

    const upstreamEntity1: UpstreamEntity = {
        name: 'test1',
        server: [
            {
                upstreamHost: 'upstream.test',
                upstreamPort: 1231
            }
        ],
        stream: [
            {
                transitHost: 'aereqbv.com',
                transitPort: 1111,
                remoteHost: 'baidu.com',
                remotePort: 4653,
                loadBalancing: 1,
                protocol: ProtocolEnum.UDP,
                isRetries: RetriesEnum.ON,
                tries: 5,
                retriesTimeout: '5s',
                connectTimeout: '2s',
                uploadRate: '100',
                downloadRate: '100',
                proxyTimeout: '2s'
            },
            {
                transitHost: 'aereqbv.com',
                transitPort: 1111,
                remoteHost: 'baidu.com',
                remotePort: 4653,
                loadBalancing: 1,
                isRetries: RetriesEnum.ON,
                tries: 5,
                retriesTimeout: '5s',
                connectTimeout: '2s',
                uploadRate: '100',
                downloadRate: '100',
                proxyTimeout: '2s'
            }
        ]
    }

    const upstreamEntity2: UpstreamEntity = {
        name: 'test2',
        server: [
            {
                upstreamHost: 'upstream.test',
                upstreamPort: 1231
            }
        ],
        stream: [
            {
                transitHost: 'aereqbv.com',
                transitPort: 1111,
                remoteHost: 'baidu.com',
                remotePort: 4653,
                loadBalancing: 1,
                protocol: ProtocolEnum.UDP,
                isRetries: RetriesEnum.ON,
                tries: 5,
                retriesTimeout: '5s',
                connectTimeout: '2s',
                uploadRate: '100',
                downloadRate: '100',
                proxyTimeout: '2s'
            },
            {
                transitHost: 'aereqbv.com',
                transitPort: 1111,
                remoteHost: 'baidu.com',
                remotePort: 4653,
                loadBalancing: 1,
                isRetries: RetriesEnum.ON,
                tries: 5,
                retriesTimeout: '5s',
                connectTimeout: '2s',
                uploadRate: '100',
                downloadRate: '100',
                proxyTimeout: '2s'
            }
        ]
    }

    describe('create', () => {
        it('UpstreamService.create fault', async () => {
            expect(await upstreamService.create(upstreamEntity1)).not.toBeNull()
            expect(await upstreamService.create(upstreamEntity2)).not.toBeNull()
        })
    })

    describe('createAll', () => {
        it('UpstreamService.createAll fault', async () => {
            expect(await upstreamService.createAll([upstreamEntity1, upstreamEntity2])).not.toBeNull()
        })
    })

    describe('findAll', () => {
        it('UpstreamService.findAll fault', async () => {
            await repository.save(upstreamEntity1)
            expect(await upstreamService.findAll()).toHaveLength(1)
            await repository.save(upstreamEntity2)
            expect(await upstreamService.findAll()).toHaveLength(2)
        })
    })

    describe('findByName', () => {
        it('UpstreamService.findByName fault', async () => {
            await repository.save(upstreamEntity1)
            await repository.save(upstreamEntity2)
            expect(await upstreamService.findByName(upstreamEntity1.name)).not.toBeNull()
            expect(await upstreamService.findByName(upstreamEntity2.name)).not.toBeNull()
        })
    })

    describe('findByNames', () => {
        it('UpstreamService.findByNames fault', async () => {
            await repository.save(upstreamEntity1)
            await repository.save(upstreamEntity2)
            expect(await upstreamService.findByNames([upstreamEntity1.name, upstreamEntity2.name])).toHaveLength(2)
        })
    })
    describe('findOne', () => {
        it('UpstreamService.findByNames fault', async () => {
            await repository.save(upstreamEntity1)
            await repository.save(upstreamEntity2)
            expect(await upstreamService.findByNames([upstreamEntity1.name, upstreamEntity2.name])).toHaveLength(2)
        })
    })
})
