import { Test } from '@nestjs/testing'
import { ExecutorModule } from '@x-forward/executor'
import {
    AutomapperRegister,
    CacheRegister,
    EventEmitterRegister,
    TypeOrmRegister
} from 'apps/x-forward-server/src/config/register.config'
import { EventModule } from '../../event/event.module'
import { GatewayModule } from '../../gateway/gateway.module'
import { ServerModule } from '../../upstream/server/server.module'
import { EnvService } from '../env.service'

describe('EnvService', () => {
    let envService: EnvService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                GatewayModule,
                ServerModule,
                ExecutorModule,
                EventModule,
                CacheRegister(),
                TypeOrmRegister(),
                AutomapperRegister(),
                EventEmitterRegister()
            ],
            providers: [EnvService]
        }).compile()
        await moduleRef.init()
        envService = moduleRef.get<EnvService>(EnvService)
    })

    describe('fetchNginxConfigArgs', () => {
        it('EnvService.fetchNginxConfigArgs fault', async () => {
            expect(await envService.fetchNginxConfigArgs()).not.toBeUndefined()
        })
    })

    describe('getNginxPath', () => {
        it('EnvService.getNginxPath fault', async () => {
            expect(await envService.getNginxPath()).not.toBeUndefined()
        })
    })

    describe('getSystemInfo', () => {
        it('EnvService.getSystemInfo fault', async () => {
            expect(await envService.getSystemInfo()).not.toBeUndefined()
        })
    })

    describe('getOverview', () => {
        it('EnvService.getOverview fault', async () => {
            expect(await envService.getOverview()).not.toBeUndefined()
        })
    })

    describe('fetchNginxStreamFile', () => {
        it('EnvService.getOverview fault', async () => {
            expect(await envService.fetchNginxStreamFile()).not.toBeUndefined()
        })
    })
})
