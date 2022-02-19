import { Test } from '@nestjs/testing'
import { ExecutorModule } from '@x-forward/executor'
import { CacheRegister } from '../../../config/register.config'
import { QueryGatewayService } from '../services/query-gateway.service'

describe('GatewayService', () => {
    describe('QueryGatewayService', () => {
        let queryGatewayService: QueryGatewayService
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [ExecutorModule, CacheRegister()],
                providers: [QueryGatewayService]
            }).compile()
            await moduleRef.init()
            queryGatewayService = moduleRef.get<QueryGatewayService>(QueryGatewayService)
        })

        describe('fetchNginxConfigArgs', () => {
            it('QueryGatewayService.fetchNginxConfigArgs fault', async () => {
                const nginxConfig = await queryGatewayService.fetchNginxConfigArgs()
                expect(nginxConfig).not.toBeUndefined()
            })
        })

        describe('fetchNginxStreamConfigContent', () => {
            it('QueryGatewayService.fetchNginxStreamConfigContent fault', async () => {
                const streamContent = await queryGatewayService.fetchNginxStreamConfigContent()
                expect(streamContent).not.toBeUndefined()
            })
        })

        describe('fetchDirectoryByUrl', () => {
            it('QueryGatewayService.fetchDirectoryByUrl fault', async () => {
                const directories = await queryGatewayService.fetchDirectoryByUrl('/etc')
                expect(directories.length).toBeGreaterThanOrEqual(0)
            })
        })

        describe('queryNginxStatus', () => {
            it('QueryGatewayService.queryNginxStatus fault', async () => {
                const nginxStatus = await queryGatewayService.queryNginxStatus()
                expect(nginxStatus).not.toBeUndefined()
            })
        })

        describe('getSystemInfo', () => {
            it('QueryGatewayService.getSystemInfo fault', async () => {
                const systemInfo = await queryGatewayService.getSystemInfo()
                expect(systemInfo).not.toBeUndefined()
            })
        })

        describe('getNginxBin', () => {
            it('QueryGatewayService.getNginxBin fault', async () => {
                const nginxBin = await queryGatewayService.getNginxBin()
                expect(nginxBin).not.toBeUndefined()
            })
        })
    })
})
