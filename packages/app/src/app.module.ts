import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from './modules/env/env.module'
import { ShellModule } from './modules/shell/shell.module'
import { StreamModule } from './modules/stream/stream.module'
import { UserModule } from './modules/user/user.module'
@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot(),
        CacheModule.register(),
        UserModule,
        EnvModule,
        ShellModule,
        StreamModule
    ]
})
export class AppModule {}
