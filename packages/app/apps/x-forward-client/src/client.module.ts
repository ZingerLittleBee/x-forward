import { Module } from '@nestjs/common'
import { LogModule } from './modules/log/log.module'

@Module({
    imports: [LogModule],
    controllers: [],
    providers: []
})
export class ClientModule {}
