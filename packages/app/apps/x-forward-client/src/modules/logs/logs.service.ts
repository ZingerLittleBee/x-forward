import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { errorHandleWarpper } from '@x-forward/common/utils/error.util'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { createReadStream } from 'fs'
import { watch } from 'fs/promises'
import { debounce } from 'lodash'
import * as moment from 'moment'
import { createInterface } from 'readline'
import { firstValueFrom, Observable } from 'rxjs'
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
        this.lastTime = await this.getLastTime()
        this.judgeStartLine(this.nginxStreamLogPath, this.lastTime)
        this.watchLog(await this.executorService.getNginxStreamLogPath())
    }

    private reportService: IReportService

    private logQueue: LogsDto[]

    private readedLine: number

    private startLine: number

    private lastTime: string

    private nginxStreamLogPath: string

    private logReadObservable: Observable<any>

    private async getLastTime() {
        return await errorHandleWarpper<string>(() => {
            return firstValueFrom(this.reportService.getLastTime({ id: this.registerService.getClientId() }))
        }, 'getLastTime')
    }

    private judgeStartLine(path: string, lastTime: string) {
        this.logReadObservable = new Observable(subsriber => {
            if (!lastTime) {
                this.startLine = 0
                Logger.verbose(`log read start line is 0`)
                this.readFileByLine(
                    path,
                    line => this.logQueue.push(this.handleLogByLine(line)),
                    () => subsriber.complete()
                )
                return
            }
            Logger.debug(`正在检查 ${path}`)
            const rl = createInterface({
                input: createReadStream(path, {
                    start: 0,
                    end: Infinity
                })
            })
            let startNum = 0
            rl.on('line', line => {
                const { time } = this.handleLogByLine(line)
                Logger.verbose(`lastTime: ${lastTime} vs time: ${time}`)
                if (moment(time).isAfter(moment(lastTime))) {
                    this.logQueue.push(this.handleLogByLine(line))
                    this.startLine = startNum
                }
                startNum++
            })
            rl.on('close', () => {
                console.log(`read finished, startLine is ${this.startLine}`)
                subsriber.complete()
            })
        })
    }

    // private async initReadedLine() {}

    private readFileByLine(path: string, onLine: (line: string) => void, onClose?: () => void) {
        console.log('readFileByLine this.startLine', this.startLine)

        const rl = createInterface({
            input: createReadStream(path, {
                start: this.startLine,
                end: Infinity
            })
        })
        rl.on('line', onLine)
        rl.on(
            'close',
            onClose
                ? onClose
                : () => {
                      rl.close()
                      console.log('read finished')
                  }
        )
    }

    private async watchLog(path: string) {
        Logger.debug(`${path}, 发现, 正在监听文件变化`)
        const readFileByLineDe = debounce(() => {
            this.readFileByLine(path, line => {
                Logger.verbose(`watch file new line: ${line}`)
                this.startLine++
                console.log('this.startLine', this.startLine)
                this.logQueue.push(this.handleLogByLine(line))
            })
        }, 1000)
        this.logReadObservable.subscribe({
            complete: async () => {
                Logger.verbose(`${path} 初始化结束`)
                Logger.verbose(`正在监听 ${path} 文件变化`)
                try {
                    const watcher = watch(path)
                    for await (const event of watcher) {
                        console.log('event', event)
                        if (event.eventType === 'change') {
                            readFileByLineDe()
                        }
                    }
                } catch (err) {
                    if (err.name === 'AbortError') return
                    throw err
                }
            }
        })
    }

    private handleLogByLine(line: string) {
        if (!line) return
        const segment = line.split(' ')
        if (segment.length !== 14) return
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
