import { Injectable } from '@nestjs/common'
import { ExecutorInterface } from './executor.interface'

@Injectable()
export class ExecutorLocal implements ExecutorInterface {
    mainConfigPatch: () => void
    getStreamConfigPath: () => Promise<string>
    getHTTPConfigPath: () => Promise<string>
    getStreamFileContent: () => Promise<string>
    streamPatch() {}
}
