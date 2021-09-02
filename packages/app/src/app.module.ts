import { Module } from '@nestjs/common'
import { EnvModule } from './modules/env/env.module'
import { ShellModule } from './modules/shell/shell.module'

@Module({
  imports: [EnvModule, ShellModule]
})
export class AppModule {}
