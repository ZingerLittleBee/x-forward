import { Module } from '@nestjs/common'
import { ExecutorController } from './executor.controller'
import { ExecutorService } from './executor.service'

@Module({
    imports: [],
    controllers: [ExecutorController],
    providers: [ExecutorService]
})
export class ExecutorModule {}
