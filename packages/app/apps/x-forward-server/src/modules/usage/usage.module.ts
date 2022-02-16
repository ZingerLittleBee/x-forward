import { Module } from '@nestjs/common'
import { UsageService } from './usage.service'

@Module({
    imports: [],
    providers: [UsageService],
    exports: [UsageService]
})
export class UsageModule {}
