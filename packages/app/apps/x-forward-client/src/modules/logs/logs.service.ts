import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { errorHandleWarpper } from '@x-forward/common/utils/error.util'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { createReadStream, existsSync } from 'fs'
import * as moment from 'moment'
import { createInterface } from 'readline'
import { firstValueFrom } from 'rxjs'
import { inspect } from 'util'
import { IReportService } from '../../interfaces/report.interface'
import { GrpcHelperService } from '../grpc-helper/grpc-helper.service'
import { RegisterService } from '../register/register.service'
import { LogsDto } from './logs.dto'

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly executorService: ExecutorService,
        private readonly registerService: RegisterService,
        private readonly grpcHelperService: GrpcHelperService
    ) {}

    async onModuleInit() {
        this.reportService = this.grpcHelperService.reportService
        this.logQueue = []
        this.readedLine = 0
        this.nginxStreamLogPath = await this.executorService.getNginxStreamLogPath()
        this.getLastTime()
        // this.watchLog(await this.executorService.getNginxStreamLogPath())
    }

    private reportService: IReportService

    private logQueue: LogsDto[]

    private readedLine: number

    private lastTime: string

    private nginxStreamLogPath: string

    private async getLastTime() {
        console.log('this.registerService.getClientId()', this.registerService.getClientId())
        return await errorHandleWarpper<Date>(() => {
            return firstValueFrom(this.reportService.getLastTime({ id: this.registerService.getClientId() }))
        }, 'getLastTime')
    }

    private judgeStartLine(path: string, lastTime: string) {
        if (existsSync(path)) {
            Logger.debug(`${path}, 存在, 正在检查文件`)
            const rl = createInterface({
                input: createReadStream(path, {
                    start: 0,
                    end: Infinity
                })
            })
            rl.on('line', line => {
                const { time } = this.handleLogByLine(line)
                Logger.verbose(`lastTime: ${lastTime} vs time: ${time}`)
                if (moment(time).isAfter(moment(lastTime))) {
                    rl.close()
                    rl.removeAllListeners()
                }
            })
            rl.on('close', () => console.log('read finished'))
        } else {
            Logger.error(`path: ${path}, 不存在`)
        }
    }

    // private async initReadedLine() {}

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
            clientPort,
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
            userId: this.registerService.getUserAndPortRelations()?.find(r => r.ports?.includes(clientPort))?.[0]
                ?.userId,
            clientId: this.registerService.getClientId(),
            clientPort,
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
