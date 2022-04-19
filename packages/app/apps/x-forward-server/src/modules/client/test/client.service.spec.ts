import { classes } from '@automapper/classes'
import { AutomapperModule } from '@automapper/nestjs'
import { ScheduleModule } from '@nestjs/schedule'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServerEntity } from '../../server/entity/server.entity'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { StreamModule } from '../../stream/stream.module'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'
import { UserEntity } from '../../user/user.entity'
import { ClientService } from '../client.service'
import { ClientEntity } from '../entity/client.entity'

describe('ClientService', () => {
    let clientService: ClientService
    let repository: Repository<ClientEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
                    database: `${process.cwd()}/x-forward.db`,
                    entities: [ClientEntity, StreamEntity, UpstreamEntity, ServerEntity, UserEntity],
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true
                }),
                TypeOrmModule.forFeature([ClientEntity]),
                AutomapperModule.forRoot({
                    options: [{ name: 'blah', pluginInitializer: classes }],
                    singular: true
                }),
                ScheduleModule.forRoot(),
                StreamModule
            ],
            providers: [ClientService]
        }).compile()
        // make sure `onModuleInit` called
        await moduleRef.init()
        repository = moduleRef.get<Repository<ClientEntity>>(getRepositoryToken(ClientEntity))
        clientService = moduleRef.get<ClientService>(ClientService)
    })

    let clientEntity1: ClientEntity
    let clientEntity2: ClientEntity

    beforeEach(() => {
        clientEntity1 = {
            ip: '123.123.123.123',
            name: 'client1',
            domain: 'client1.xxx.com',
            port: 5000
        }
        clientEntity2 = {
            ip: '234.234.234.234',
            name: 'client2',
            domain: 'client2.xxx.com',
            port: 5000
        }
    })

    afterEach(async () => {
        await repository.clear()
    })

    describe('getIds', () => {
        it('ClientService.getIds fault', async () => {
            const id1 = await clientService.register(clientEntity1)
            const id2 = await clientService.register(clientEntity2)
            const ids = (await clientService.getIds())?.map(c => c.id)
            expect(ids).toContain(id1)
            expect(ids).toContain(id2)
        })
    })
})
