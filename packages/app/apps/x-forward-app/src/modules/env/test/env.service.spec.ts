import { EventEmitterModule } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { EOL } from 'os'
import { GatewayModule } from '../../gateway/gateway.module'
import { ServerModule } from '../../upstream/server/server.module'
import { EnvService } from '../env.service'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'

describe('EnvService', () => {
    let envService: EnvService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                GatewayModule,
                ServerModule,
                EventEmitterModule.forRoot({
                    // set this to `true` to use wildcards
                    wildcard: false,
                    // the delimiter used to segment namespaces
                    delimiter: '.',
                    // set this to `true` if you want to emit the newListener event
                    newListener: false,
                    // set this to `true` if you want to emit the removeListener event
                    removeListener: false,
                    // the maximum amount of listeners that can be assigned to an event
                    maxListeners: 10,
                    // show event name in memory leak message when more than maximum amount of listeners is assigned
                    verboseMemoryLeak: false,
                    // disable throwing uncaughtException if an error event is emitted and it has no listeners
                    ignoreErrors: false
                }),
                AutomapperModule.forRoot({
                    options: [{ name: 'blah', pluginInitializer: classes }],
                    singular: true
                })
            ],
            providers: [EnvService]
        }).compile()
        await moduleRef.init()
        envService = moduleRef.get<EnvService>(EnvService)
    })

    describe('getNginxPath', () => {
        it('EnvService.getNginxPath fault', async () => {
            expect(await envService.getNginxPath()).toContain(EOL)
        })
    })
})
