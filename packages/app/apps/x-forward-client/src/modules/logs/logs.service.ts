import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { existsSync } from 'fs'
import { watch } from 'fs/promises'

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly executorService: ExecutorService
    ) {}

    async onModuleInit() {
        console.log('getNginxStreamPath', await this.executorService.getNginxStreamPath())
        console.log('getNginxStreamLogPath', await this.executorService.getNginxStreamLogPath())
        this.watchLog(await this.executorService.getNginxStreamLogPath())
    }

    private async watchLog(path: string) {
        if (existsSync(path)) {
            try {
                const watcher = watch(path)
                for await (const event of watcher) console.log('watcher', event)
            } catch (err) {
                if (err.name === 'AbortError') return
                throw err
            }
        } else {
            setTimeout(() => this.watchLog(path), 5000)
            Logger.debug(`${path}, 不存在, 将在 5s 后重试`)
        }
    }
}
