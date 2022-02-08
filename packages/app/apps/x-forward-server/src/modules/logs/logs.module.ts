import { Module } from '@nestjs/common'
import { BucketModule } from '@x-forward/bucket'
import { LogsService } from './logs.service'
import { LogsController } from './logs.controller'

@Module({
    imports: [BucketModule],
    controllers: [LogsController],
    providers: [LogsService]
})
export class LogsModule {}
