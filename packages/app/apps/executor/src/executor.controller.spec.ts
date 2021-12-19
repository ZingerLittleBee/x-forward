import { Test, TestingModule } from '@nestjs/testing'
import { ExecutorController } from './executor.controller'
import { ExecutorService } from './executor.service'

describe('ExecutorController', () => {
    let executorController: ExecutorController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ExecutorController],
            providers: [ExecutorService]
        }).compile()

        executorController = app.get<ExecutorController>(ExecutorController)
    })

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(executorController.getHello()).toBe('Hello World!')
        })
    })
})
