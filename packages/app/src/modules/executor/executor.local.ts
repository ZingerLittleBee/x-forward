import { ExecutorInterface, NginxConfig } from "./interface/executor.interface"

export class ExecutorLocal implements ExecutorInterface {

    constructor(private bin: string) {
        this.bin = bin
    }
    getNginxVersion: () => Promise<string>
    getNginxBin: () => Promise<string>
    getNginxConfigArgs: () => Promise<NginxConfig>
    mainConfigAppend: (appendString: string) => void
    getMainConfigContent: () => Promise<string>
    getStreamDirectory: () => Promise<string>
    getPrefix: () => Promise<string>
    getMainConfigPath: () => Promise<string>
    makesureStreamDirectoryExists: () => void
    getStreamConfigPath: () => Promise<string>
    getHTTPConfigPath: () => Promise<string>
    getStreamFileContent: () => Promise<string>
    streamPatch() {}
}
