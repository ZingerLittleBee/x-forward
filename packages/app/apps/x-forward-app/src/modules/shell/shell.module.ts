import { Module } from '@nestjs/common'
import { ShellGateway } from './shell.gateway'

@Module({
    providers: [ShellGateway],
    exports: [ShellGateway]
})
export class ShellModule {}
