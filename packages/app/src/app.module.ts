import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from './modules/env/env.module'
import { ShellModule } from './modules/shell/shell.module'
// TypeOrmModule.forRoot()
@Module({
    imports: [EnvModule, ShellModule]
})
export class AppModule {}
