import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'
import { errorHandleWarpper } from '@x-forward/common/utils/error.util'
import { ExecutorService } from '@x-forward/executor'
import { CronJob } from 'cron'
import { debounce } from 'lodash'
import * as moment from 'moment'
import { createInterface } from 'readline'
import { firstValueFrom } from 'rxjs'
import { Readable } from 'stream'
import { inspect } from 'util'
import { ProcessOutput, ProcessPromise } from 'zx'
import { IReportService } from '../../interfaces/report.interface'
import { GrpcHelperService } from '../grpc-helper/grpc-helper.service'
import { RegisterService } from '../register/register.service'
import { LogsDto } from './logs.dto'

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        private readonly executorService: ExecutorService,
        private readonly registerService: RegisterService,
        private readonly grpcHelperService: GrpcHelperService,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    async onModuleInit() {
        this.reportService = this.grpcHelperService.reportService
        this.logQueue = []
        await this.initLogs()
    }

    private async initLogs() {
        if (!this.registerService.getClientId()) {
            setTimeout(() => this.initLogs(), 4000)
            Logger.error(`logs 初始化失败, client 未初始化成功`)
            return
        }
        this.lastTime = await this.getLastTime()
        this.watchLogs(await this.executorService.getNginxStreamLogPath())
        this.addCronJob('LogsUpload', () => this.logsUpload(), getEnvSetting(EnvKeyEnum.OnlineCheckCron))
    }

    async logsUpload() {
        if (this.logQueue.length > 0) {
            Logger.verbose(`logs: ${inspect(this.logQueue)} upload`)
            const { success } = await firstValueFrom(this.reportService.logReport({ logs: this.logQueue }))
            if (!success) {
                if (this.logQueue.length > 50000) {
                    Logger.warn('log queue is so big than 5w, please check program, and this log queue will be discard')
                    this.logQueue.length = 0
                }
                Logger.verbose(`upload failed, try upload again`)
                this.logsUpload()
                return
            }
            Logger.verbose(`${this.logQueue.length} pieces of logs were uploaded successfully`)
        }
        this.logQueue.length = 0
    }

    private addCronJob(name: string, task: () => void, interval: string) {
        const job = new CronJob(interval, task, null, null, null, null, true)
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        Logger.log(`job ${name} added at ${interval}`)
    }

    private reportService: IReportService

    private logQueue: LogsDto[]

    private lastTime: string

    private async getLastTime() {
        return await errorHandleWarpper<string>(() => {
            return firstValueFrom(this.reportService.getLastTime({ id: this.registerService.getClientId() }))
        }, 'getLastTime')
    }

    private readFileByLine(readStream: Readable, onLine: (line: string) => void, onClose?: () => void) {
        const rl = createInterface({
            input: readStream
        })
        rl.on('line', onLine)
        rl.on('close', onClose)
    }

    private watchLogsDe = debounce((path: string) => this.watchLogs(path), 2000)

    private async watchLogs(path: string) {
        await this.executorService.existOrCreate(path)
        if (!this.lastTime) {
            const now = moment().toISOString()
            this.lastTime = now
            Logger.warn(`got last time failed, then last time will be set now: ${now}`)
        }
        let process: ProcessPromise<ProcessOutput>
        const { stdout, stderr } = (process = this.executorService.getTailFileProcess(path))
        process.catch(Logger.error)
        this.readFileByLine(
            stdout,
            line => {
                const { time } = this.handleLogByLine(line)
                if (moment(time).isAfter(moment(this.lastTime))) {
                    this.logQueue.push(this.handleLogByLine(line))
                }
            },
            () => {
                Logger.error(`readline 关闭`)
            }
        )
        stderr.on('data', chunk => {
            process.kill()
            Logger.error(`watch ${path} occur error: ${chunk.toString()}, and then will try watch again`)
            this.watchLogsDe(path)
        })
    }

    /**
     * parse logs file by line to LogsDto
     * @param line stream log line
     * @returns {LogsDto}
     */
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
