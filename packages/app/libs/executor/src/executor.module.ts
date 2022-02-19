import { CacheModule, Module } from '@nestjs/common'
import { ExecutorService } from './services/executor.service'
import { ExecutorController } from '@x-forward/executor/executor.contoller'

@Module({
    imports: [CacheModule.register({ ttl: 0, isGlobal: true })],
    providers: [ExecutorService],
    controllers: [ExecutorController],
    exports: [ExecutorService]
})
export class ExecutorModule {}

// export class ExecutorModule {
//     static register(options: string): DynamicModule {
//         let providers = []
//         providers.push({
//             provide: ENV_EXECUTOR,
//             useClass:
//                 options === EnvEnum.DockerContainerName
//                     ? ExecutorDocker
//                     : ExecutorLocal
//         })
//         return {
//             module: ExecutorModule,
//             providers,
//             exports: [ENV_EXECUTOR]
//         }
//     }
// }

// export const ENV_EXECUTOR = 'ENV_EXECUTOR'
