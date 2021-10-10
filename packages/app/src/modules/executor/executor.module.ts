import { CacheModule, DynamicModule, Module } from '@nestjs/common'
import { EnvEnum } from '../../enums/EnvEnum'
import { ExecutorDocker } from './executor.docker'
import { ExecutorLocal } from './executor.local'
import { ExecutorService } from './executor.service'

@Module({
    imports: [CacheModule.register()],
    providers: [ExecutorService]
})
export class ExecutorModule {
    static register(options: string): DynamicModule {
        let providers = []
        providers.push({
            provide: ENV_EXECUTOR,
            useClass:
                options === EnvEnum.DOCKER_CONTAINER_NAME
                    ? ExecutorDocker
                    : ExecutorLocal
        })
        return {
            module: ExecutorModule,
            providers,
            exports: [ENV_EXECUTOR]
        }
    }
}

export const ENV_EXECUTOR = 'ENV_EXECUTOR'
