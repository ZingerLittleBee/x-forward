import { Test } from '@nestjs/testing'
import { ExecutorModule } from '@x-forward/executor'
import { CacheRegister } from '../../../config/register.config'
import { ExecutorGatewayService } from '../executor-gateway.service'
import { QueryGatewayService } from '../query-gateway.service'

describe('GatewayService', () => {
    describe('ExecutorGatewayService', () => {
        let executorGatewayService: ExecutorGatewayService
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [ExecutorModule, CacheRegister()],
                providers: [QueryGatewayService]
            }).compile()
            await moduleRef.init()
            executorGatewayService = moduleRef.get<ExecutorGatewayService>(ExecutorGatewayService)
        })

        describe('streamPatch', () => {
            it('ExecutorGatewayService.streamPatch fault', async () => {
                // const nginxConfig = await executorGatewayService.streamPatch()
                // expect(nginxConfig).not.toBeUndefined()
            })
        })
    })
})
