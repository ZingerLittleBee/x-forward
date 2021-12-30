import { Test } from '@nestjs/testing'
import { ExecutorModule } from '../../executor/executor.module'
import { QueryGatewayService } from '../query-gateway.service'
import { ExecutorGatewayService } from '../executor-gateway.service'
import { CacheRegister } from '../../../config/register.config'

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
