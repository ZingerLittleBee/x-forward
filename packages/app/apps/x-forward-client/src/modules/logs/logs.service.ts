import { CACHE_MANAGER, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ExecutorService } from '@x-forward/executor'

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly executorService: ExecutorService
    ) {}

    async onModuleInit() {
        console.log('getNginxStreamPath', await this.executorService.getNginxStreamPath())
    }
}
