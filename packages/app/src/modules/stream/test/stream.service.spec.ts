import { EventEmitterModule } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { EventModule } from 'src/modules/event/event.module'
import { ServerEntity } from 'src/modules/upstream/server/entities/server.entity'
import { UpstreamEntity } from 'src/modules/upstream/upstream.entity'
import { Repository } from 'typeorm'
import { StreamEntity } from '../stream.entity'
import { StreamService } from '../stream.service'

describe('StreamService', () => {
    let streamService: StreamService
    let repository: Repository<StreamEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
                    database: '../../../../x-forward.db',
                    entities: [StreamEntity, UpstreamEntity, ServerEntity],
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true,
                    keepConnectionAlive: true
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
                TypeOrmModule.forFeature([StreamEntity]),
                EventModule
            ],
            providers: [StreamService]
        }).compile()
        // make sure `onModuleInit` called
        await moduleRef.init()
        repository = moduleRef.get<Repository<StreamEntity>>(getRepositoryToken(StreamEntity))
        streamService = moduleRef.get<StreamService>(StreamService)
    })

    afterEach(() => {
        repository.clear()
    })

    const streamEntitiy: StreamEntity = {
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
    }

    describe('findNullFK', () => {
        it('StreamService.findNullFK fault', async () => {
            await streamService.create(streamEntitiy)
            expect(await streamService.findNullFK()).toHaveLength(1)
        })
    })
})
