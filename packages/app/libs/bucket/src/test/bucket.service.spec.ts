import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Log } from '@x-forward/bucket/schemas/log.schema'
import { BucketService } from '@x-forward/bucket'

const mockLog = {
    serverId: 'qwe123',
    useId: 'user1',
    serverAddr: '12.324.1.3',
    serverPort: '1234',
    remoteAddr: '134.4.41.1',
    remotePort: '12345',
    protocol: 'tcp',
    status: '1',
    bytes_sent: '123',
    bytes_received: '43',
    upstream_addr: '134.4.41.1',
    upstream_bytes_sent: '12',
    upstream_bytes_received: '123',
    upstream_connect_time: '4',
    upstream_session_time: '1',
    time: new Date().getUTCDate()
}

describe('BucketService', () => {
    let service: BucketService
    let model: Model<Log>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BucketService,
                {
                    provide: getModelToken('Log'),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockLog),
                        constructor: jest.fn().mockResolvedValue(mockLog),
                        find: jest.fn(),
                        create: jest.fn(),
                        exec: jest.fn()
                    }
                }
            ]
        }).compile()

        service = module.get<BucketService>(BucketService)
        model = module.get<Model<Log>>(getModelToken('Log'))
    })

    it('findAll', async () => {
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce([mockLog])
        } as any)
        console.log(await service.findAll())
    })
})
