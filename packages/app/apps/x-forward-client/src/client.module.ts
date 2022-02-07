import { Module } from '@nestjs/common'
import { LogsModule } from './modules/logs/logs.module'

@Module({
    imports: [LogsModule],
    controllers: [],
    providers: []
})
export class ClientModule {}
