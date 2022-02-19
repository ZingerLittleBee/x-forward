import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { createReadStream, existsSync } from 'fs'
import { createInterface } from 'readline'

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
            Logger.debug(`${path}, 发现, 正在监听文件变化`)
            // try {
            //     const watcher = watch(path)
            //     for await (const event of watcher) console.log('watcher', event)
            // } catch (err) {
            //     if (err.name === 'AbortError') return
            //     throw err
            // }
            const rl = createInterface({
                input: createReadStream(path, {
                    start: 0,
                    end: Infinity
                })
            })
            rl.on('line', line => console.log('line', line))
            rl.on('close', () => console.log('read finished'))
        } else {
            setTimeout(() => this.watchLog(path), 5000)
            Logger.debug(`stream log path: ${path}, 不存在, 将在 5s 后重试`)
        }
    }

    private handleLogByLine(line: string) {
        console.log(line)
        // const segment = line.split(' ')
    }
}
