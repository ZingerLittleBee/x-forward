import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'
import { AutomapperRegister, EventEmitterRegister, TypeOrmRegister } from '../../../config/register.config'
import { EventModule } from '../../event/event.module'
import { StreamModule } from '../../stream/stream.module'
import { ServerEntity } from '../entity/server.entity'
import { ServerModule } from '../server.module'
import { ServerProfile } from '../server.profile'
import { ServerService } from '../server.service'

describe('UpstreamService', () => {
    let serverService: ServerService
    let repository: Repository<ServerEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmRegister(),
                EventEmitterRegister(),
                AutomapperRegister(),
                TypeOrmModule.forFeature([ServerEntity]),
                ServerModule,
                StreamModule,
                EventModule
            ],
            providers: [ServerService, ServerProfile]
        }).compile()
        await moduleRef.init()
        repository = moduleRef.get<Repository<ServerEntity>>(getRepositoryToken(ServerEntity))
        serverService = moduleRef.get<ServerService>(ServerService)
        await repository.clear()
    })

    let serverEntity1: ServerEntity
    let serverEntity2: ServerEntity

    beforeEach(() => {
        serverEntity1 = {
            upstreamHost: 'bing.com',
            upstreamPort: 1234,
            weight: 1,
            maxCons: 5,
            maxFails: 5,
            failTimeout: '5s',
            backup: 0,
            down: 0
        }
        serverEntity2 = {
            upstreamHost: 'baidu.com',
            upstreamPort: 4567,
            weight: 5,
            maxCons: 10,
            maxFails: 10,
            failTimeout: '10s',
            backup: 1,
            down: 0
        }
    })

    afterEach(() => {
        repository.clear()
    })

    describe('createAll', () => {
        it('ServerService.createAll fault', async () => {
            await serverService.createAll([serverEntity1, serverEntity2])
            const findAll = await repository.find()
            expect(findAll).toHaveLength(2)
            const [createdServer1, createdServer2] = findAll
            expect(createdServer1).toEqual({ ...createdServer1, ...serverEntity1 })
            expect(createdServer2).toEqual({ ...createdServer2, ...serverEntity2 })
        })
    })

    describe('update', () => {
        it('ServerService.update fault', async () => {
            const { id: id1 } = await repository.save(serverEntity1)
            const { id: id2 } = await repository.save(serverEntity2)
            const { affected: affected1 } = await serverService.update(id1, serverEntity2)
            expect(affected1).toEqual(1)
            const { affected: affected2 } = await serverService.update(id2, serverEntity1)
            expect(affected2).toEqual(1)
            const updatedServers = await repository.findByIds([id1, id2])
            updatedServers.forEach(u => {
                if (u.id === id1) {
                    expect(u).toEqual({ ...u, ...serverEntity2, id: id1 })
                }
                if (u.id === id2) {
                    expect(u).toEqual({ ...u, ...serverEntity1, id: id2 })
                }
            })
        })
    })

    describe('updateAll', () => {
        it('ServerService.updateAll fault', async () => {
            const { id: id1 } = await repository.save(serverEntity1)
            const { id: id2 } = await repository.save(serverEntity2)
            const updateServer1 = { ...serverEntity2, id: id1 }
            const updateServer2 = { ...serverEntity1, id: id2 }
            const affectCount = await serverService.updateAll([updateServer1, updateServer2])
            expect(affectCount).toEqual(2)
            const updatedServers = await repository.findByIds([id1, id2])
            updatedServers.forEach(u => {
                if (u.id === id1) {
                    expect(u).toEqual({ ...u, ...updateServer1 })
                }
                if (u.id === id2) {
                    expect(u).toEqual({ ...u, ...updateServer2 })
                }
            })
        })
    })

    describe('remove', () => {
        it('ServerService.remove fault', async () => {
            const { id: id1 } = await repository.save(serverEntity1)
            const { id: id2 } = await repository.save(serverEntity2)
            const { affected: affected1 } = await serverService.remove(id1)
            expect(affected1).toEqual(1)
            const afterRemoved1 = await repository.findOne({ id: id1 })
            expect(afterRemoved1).toBeUndefined()
            const { affected: affected2 } = await serverService.remove(id2)
            expect(affected2).toEqual(1)
            const afterRemoved2 = await repository.findOne({ id: id2 })
            expect(afterRemoved2).toBeUndefined()
        })
    })

    describe('removeByFK', () => {
        it('ServerService.removeByFK fault', async () => {
            const upstreamId1 = v4()
            const upstreamId2 = v4()
            const server1 = { ...serverEntity1, upstreamId: upstreamId1 }
            const server2 = { ...serverEntity2, upstreamId: upstreamId2 }
            await repository.createQueryBuilder().insert().into(ServerEntity).values([server1, server2]).execute()
            const { affected: affected1 } = await serverService.removeByFK(upstreamId1)
            expect(affected1).toEqual(1)
            const afterRemove1 = await repository.findOne({ upstreamId: upstreamId1 })
            expect(afterRemove1).toBeUndefined()
            const { affected: affected2 } = await serverService.removeByFK(upstreamId2)
            expect(affected2).toEqual(1)
            const afterRemove2 = await repository.findOne({ upstreamId: upstreamId2 })
            expect(afterRemove2).toBeUndefined()
        })
    })
})
