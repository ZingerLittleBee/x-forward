import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
import { ExecutorModule } from 'src/modules/executor/executor.module'
import { RenderModule } from 'src/modules/render/render.module'
import { StreamEntity } from 'src/modules/stream/stream.entity'
import { StreamModule } from 'src/modules/stream/stream.module'
import { ServerEntity } from 'src/modules/upstream/server/entities/server.entity'
import { UpstreamEntity } from 'src/modules/upstream/upstream.entity'
import { UpstreamModule } from 'src/modules/upstream/upstream.module'
import { UpstreamService } from 'src/modules/upstream/upstream.service'
import { Repository } from 'typeorm'
import { ModelGatewayService } from '../model-gateway.service'

describe('GatewayService', () => {
    describe('ModelGatewayService', () => {
        let modelGatewayService: ModelGatewayService
        let upstreamService: UpstreamService
        let upstreamRepository: Repository<UpstreamEntity>
        let serverRepository: Repository<ServerEntity>
        let streamRepository: Repository<StreamEntity>
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [
                    ExecutorModule,
                    RenderModule,
                    UpstreamModule,
                    StreamModule,
                    TypeOrmModule.forRoot({
                        type: 'better-sqlite3',
                        database: '../../../../x-forward.db',
                        entities: [UpstreamEntity, ServerEntity, StreamEntity],
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
                    TypeOrmModule.forFeature([UpstreamEntity]),
                    TypeOrmModule.forFeature([ServerEntity]),
                    TypeOrmModule.forFeature([StreamEntity]),
                    AutomapperModule.forRoot({
                        options: [{ name: 'blah', pluginInitializer: classes }],
                        singular: true
                    })
                ],
                providers: [ModelGatewayService]
            }).compile()
            modelGatewayService = moduleRef.get<ModelGatewayService>(ModelGatewayService)
            upstreamService = moduleRef.get<UpstreamService>(UpstreamService)
            upstreamRepository = moduleRef.get<Repository<UpstreamEntity>>(getRepositoryToken(UpstreamEntity))
            serverRepository = moduleRef.get<Repository<ServerEntity>>(getRepositoryToken(ServerEntity))
            streamRepository = moduleRef.get<Repository<StreamEntity>>(getRepositoryToken(StreamEntity))
        })

        afterEach(() => {
            upstreamRepository.clear()
            serverRepository.clear()
            streamRepository.clear()
        })

        const upstreamEntity: UpstreamEntity = {
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

        describe('getFullStream', () => {
            it('ModelGatewayService.getFullStream error', async () => {
                await upstreamService.create(upstreamEntity)
                console.log('getFullStream', await modelGatewayService.getFullStream())
                expect(await modelGatewayService.getFullStream()).not.toBeNull()
            })
        })
    })
})
