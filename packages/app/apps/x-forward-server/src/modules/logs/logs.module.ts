import { Module } from '@nestjs/common'
import { BucketModule } from '@x-forward/bucket'
import { LogsController } from './logs.controller'
import { LogsService } from './logs.service'

@Module({
    imports: [BucketModule],
    controllers: [LogsController],
    providers: [LogsService],
    exports: [LogsService]
})
export class LogsModule {}
