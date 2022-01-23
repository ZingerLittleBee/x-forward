import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolEnum, RetriesEnum } from '@x-forward/common/enums'
import { Repository } from 'typeorm'
import { v4, validate } from 'uuid'
import { EventEmitterRegister, TypeOrmRegister } from '../../../config/register.config'
import { EventModule } from '../../event/event.module'
import { StreamEntity } from '../entity/stream.entity'
import { StreamService } from '../stream.service'

describe('StreamService', () => {
    let streamService: StreamService
    let repository: Repository<StreamEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [TypeOrmRegister(), EventEmitterRegister(), TypeOrmModule.forFeature([StreamEntity]), EventModule],
            providers: [StreamService]
        }).compile()
        // make sure `onModuleInit` called
        await moduleRef.init()
        repository = moduleRef.get<Repository<StreamEntity>>(getRepositoryToken(StreamEntity))
        streamService = moduleRef.get<StreamService>(StreamService)
    })

    let streamEntity1: StreamEntity
    let streamEntity2: StreamEntity

    beforeEach(() => {
        streamEntity1 = {
            transitHost: 'google.com',
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
        streamEntity2 = {
            transitHost: 'google.com',
            transitPort: 1234,
            remoteHost: 'baidu.com',
            remotePort: 5467,
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
    })

    afterEach(async () => {
        await repository.clear()
    })

    describe('findById', () => {
        it('StreamService.findById fault', async () => {
            const { id } = await streamService.create(streamEntity1)
            const res = await streamService.findById(id)
            expect({ ...streamEntity1, ...res }).toEqual(res)
        })
    })

    describe('findAll', () => {
        it('StreamService.findAll fault', async () => {
            await streamService.create(streamEntity1)
            expect(await streamService.findAll()).toHaveLength(1)
        })
    })

    describe('findNullFK', () => {
        it('StreamService.findNullFK fault', async () => {
            await streamService.create(streamEntity1)
            expect(await streamService.findNullFK()).toHaveLength(1)
        })
    })

    describe('upstreamIdUpdate', () => {
        it('StreamService.upstreamIdUpdate fault', async () => {
            const { id } = await streamService.create(streamEntity1)
            const upstreamId = v4()
            await streamService.upstreamIdUpdate(id, upstreamId)
            const { upstreamId: updatedUpstreamId } = await streamService.findById(id)
            expect(updatedUpstreamId).toEqual(upstreamId)
        })
    })

    describe('stateUpdate', () => {
        it('StreamService.stateUpdate fault', async () => {
            const { id, state } = await streamService.create(streamEntity1)
            expect(state).toEqual(0)
            const { affected } = await streamService.stateUpdate(id, 1)
            expect(affected).toEqual(1)
            const { state: updatedState } = await repository.findOne({ id })
            expect(updatedState).toEqual(1)
        })
    })

    describe('update', () => {
        it('StreamService.update fault', async () => {
            const stream = await repository.save(streamEntity1)
            const id = stream.id
            const { affected } = await streamService.update(id, streamEntity2)
            expect(affected).toEqual(1)
            const res = await repository.findOne({ id })
            const expectStream = { ...stream, ...streamEntity2, updateTime: res.updateTime }
            expect(res).toEqual(expectStream)
        })
    })

    describe('updateAll', () => {
        it('StreamService.updateAll fault', async () => {
            const [stream1, stream2] = await streamService.createAll([streamEntity1, streamEntity2])
            const { id: id1 } = stream1
            const { id: id2 } = stream2
            const updateRes = await streamService.updateAll([
                { ...stream2, id: id1 },
                { ...stream1, id: id2 }
            ])
            updateRes.forEach(u => {
                expect(u.affected).toEqual(1)
            })
            const updatedStream1 = await repository.findOne({ id: id1 })
            const updatedStream2 = await repository.findOne({ id: id2 })
            expect(updatedStream1).toEqual({ ...stream2, id: id1 })
            expect(updatedStream2).toEqual({ ...stream1, id: id2 })
        })
    })

    describe('delete', () => {
        it('StreamService.delete fault', async () => {
            const { id } = await streamService.create(streamEntity1)
            const findAll = await repository.find()
            expect(findAll).toHaveLength(1)
            await streamService.delete(id)
            const updatedFindAll = await repository.find()
            expect(updatedFindAll).toHaveLength(0)
        })
    })

    describe('deleteAll', () => {
        it('StreamService.deleteAll fault', async () => {
            await streamService.create(streamEntity1)
            await streamService.create(streamEntity2)
            const findAll = await repository.find()
            expect(findAll).toHaveLength(2)
            await streamService.deleteAll()
            const updatedFindAll = await repository.find()
            expect(updatedFindAll).toHaveLength(0)
        })
    })

    describe('removeByFK', () => {
        it('StreamService.removeByFK fault', async () => {
            const upstreamId = v4()
            const hasupstreamIdStream = { ...streamEntity1, upstreamId }
            await streamService.create(hasupstreamIdStream)
            const findAll = await repository.find()
            expect(findAll).toHaveLength(1)
            await streamService.removeByFK(upstreamId)
            const updatedFindAll = await repository.find()
            expect(updatedFindAll).toHaveLength(0)
        })
    })

    // update must be run before create, or may lead to id changed
    // why is it so strange who can tell me
    describe('create', () => {
        it('StreamService.create fault', async () => {
            const { id } = await streamService.create(streamEntity1)
            expect(validate(id)).toBeTruthy()
        })
    })

    describe('createAll', () => {
        it('StreamService.createAll fault', async () => {
            const res = await streamService.createAll([streamEntity1, streamEntity2])
            expect(res).toHaveLength(2)
        })
    })
})
