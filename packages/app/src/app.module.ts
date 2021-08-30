import { Module } from '@nestjs/common';
import { EnvModule } from './modules/env/env.module';

@Module({
  imports: [EnvModule],
})
export class AppModule {}
