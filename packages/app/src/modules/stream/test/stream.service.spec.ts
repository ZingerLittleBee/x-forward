import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from 'src/enums/NginxEnum'
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
                TypeOrmModule.forFeature([StreamEntity])
            ],
            providers: [StreamService]
        }).compile()
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
