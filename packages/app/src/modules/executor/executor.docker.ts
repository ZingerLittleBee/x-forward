import { Injectable } from '@nestjs/common'
import { ExecutorInterface } from './executor.interface'
import { ExecutorService } from './executor.service'

@Injectable()
export class ExecutorDocker implements ExecutorInterface {
    constructor(private executorService: ExecutorService) {}
    mainConfigPatch: () => void
    streamPatch() {}
    getStreamConfigPath: () => Promise<string>
    getHTTPConfigPath: () => Promise<string>
    getStreamFileContent: () => Promise<string>
}
