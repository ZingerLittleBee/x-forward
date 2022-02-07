import { Module } from '@nestjs/common'
import { UsageService } from './usage.service'
import { UsageController } from './usage.controller'

@Module({
    imports: [],
    controllers: [UsageController],
    providers: [UsageService],
    exports: [UsageService]
})
export class UsageModule {}
