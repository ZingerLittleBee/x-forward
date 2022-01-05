import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from '@x-forward/common/enums'
import { ExecutorModule } from '@x-forward/executor'
import { Repository } from 'typeorm'
import { AutomapperRegister, EventEmitterRegister, TypeOrmRegister } from '../../../config/register.config'
import { EventModule } from '../../event/event.module'
import { StreamEntity } from '../../stream/stream.entity'
import { StreamModule } from '../../stream/stream.module'
import { ServerEntity } from '../../upstream/server/entities/server.entity'
import { UpstreamEntity } from '../../upstream/upstream.entity'
import { UpstreamModule } from '../../upstream/upstream.module'
import { UpstreamService } from '../../upstream/upstream.service'
import { ModelGatewayService } from '../model-gateway.service'
import { RenderModule } from '@x-forward/render'

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
                    EventModule,
                    TypeOrmRegister(),
                    EventEmitterRegister(),
                    AutomapperRegister(),
                    TypeOrmModule.forFeature([UpstreamEntity]),
                    TypeOrmModule.forFeature([ServerEntity]),
                    TypeOrmModule.forFeature([StreamEntity])
                ],
                providers: [ModelGatewayService]
            }).compile()
            await moduleRef.init()
            modelGatewayService = moduleRef.get<ModelGatewayService>(ModelGatewayService)
            upstreamService = moduleRef.get<UpstreamService>(UpstreamService)
            upstreamRepository = moduleRef.get<Repository<UpstreamEntity>>(getRepositoryToken(UpstreamEntity))
            serverRepository = moduleRef.get<Repository<ServerEntity>>(getRepositoryToken(ServerEntity))
            streamRepository = moduleRef.get<Repository<StreamEntity>>(getRepositoryToken(StreamEntity))
        })

        let upstreamEntity: UpstreamEntity

        beforeEach(() => {
            upstreamEntity = {
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
        })

        afterEach(() => {
            upstreamRepository.clear()
            serverRepository.clear()
            streamRepository.clear()
        })

        describe('getFullStream', () => {
            it('ModelGatewayService.getFullStream error', async () => {
                await upstreamService.create(upstreamEntity)
                expect(await modelGatewayService.getFullStream()).not.toBeNull()
            })
        })
    })
})
