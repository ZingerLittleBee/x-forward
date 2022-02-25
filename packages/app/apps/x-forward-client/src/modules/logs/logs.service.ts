import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { createReadStream, existsSync } from 'fs'
import { createInterface } from 'readline'
import { inspect } from 'util'
import { RegisterService } from '../register/register.service'
import { LogsDto } from './logs.dto'

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly executorService: ExecutorService,
        private readonly registerService: RegisterService
    ) {}

    async onModuleInit() {
        this.logQueue = []
        this.readedLine = 0
        this.watchLog(await this.executorService.getNginxStreamLogPath())
    }

    private logQueue: LogsDto[]

    private readedLine: number

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
            rl.on('line', line => console.log('line', inspect(this.handleLogByLine(line))))
            rl.on('close', () => console.log('read finished'))
        } else {
            setTimeout(() => this.watchLog(path), 5000)
            Logger.debug(`stream log path: ${path}, 不存在, 将在 5s 后重试`)
        }
    }

    private handleLogByLine(line: string) {
        const segment = line.split(' ')
        const [
            serverPort,
            remoteAddr,
            remotePort,
            protocol,
            status,
            bytesSent,
            bytesReceived,
            sessionTime,
            upstreamAddr,
            upstreamBytesSent,
            upstreamBytesReceived,
            upstreamConnectTime,
            upstreamSessionTime,
            time
        ] = segment
        return {
            serverId: this.registerService.getClientId(),
            userId: this.registerService.getUserAndPortRelations()?.find(r => r.ports?.includes(serverPort))?.[0]
                ?.userId,
            serverPort,
            remoteAddr,
            remotePort,
            protocol,
            status,
            bytesSent,
            bytesReceived,
            sessionTime,
            upstreamAddr,
            upstreamBytesSent,
            upstreamBytesReceived,
            upstreamConnectTime,
            upstreamSessionTime,
            time
        }
    }
}
