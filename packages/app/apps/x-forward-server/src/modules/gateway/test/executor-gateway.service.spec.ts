import { Test } from '@nestjs/testing'
import { ExecutorModule } from '@x-forward/executor'
import { AutomapperRegister, CacheRegister, TypeOrmRegister } from '../../../config/register.config'
import { QueryGatewayService } from '../query-gateway.service'
import { GatewayModule } from '../gateway.module'

describe('GatewayService', () => {
    describe('ExecutorGatewayService', () => {
        // let executorGatewayService: ExecutorGatewayService
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [TypeOrmRegister(), AutomapperRegister(), GatewayModule, ExecutorModule, CacheRegister()],
                providers: [QueryGatewayService]
            }).compile()
            await moduleRef.init()
            // executorGatewayService = moduleRef.get<ExecutorGatewayService>(ExecutorGatewayService)
        })

        describe('streamPatch', () => {
            it('ExecutorGatewayService.streamPatch fault', async () => {
                // const nginxConfig = await executorGatewayService.streamPatch()
                // expect(nginxConfig).not.toBeUndefined()
            })
        })
    })
})
