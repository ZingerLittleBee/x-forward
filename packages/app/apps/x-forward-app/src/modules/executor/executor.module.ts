import { CacheModule, Module } from '@nestjs/common'
import { ExecutorService } from './executor.service'

@Module({
    imports: [CacheModule.register({ ttl: 0 })],
    providers: [ExecutorService],
    exports: [ExecutorService]
})
export class ExecutorModule {}

// export class ExecutorModule {
//     static register(options: string): DynamicModule {
//         let providers = []
//         providers.push({
//             provide: ENV_EXECUTOR,
//             useClass:
//                 options === EnvEnum.DOCKER_CONTAINER_NAME
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
