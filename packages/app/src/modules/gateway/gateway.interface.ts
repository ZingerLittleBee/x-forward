import { NginxConfig } from '../executor/interface/executor.interface'

export interface GatewayApi {
    fetchNginxConfigArgs: () => Promise<NginxConfig>
    fetchNginxStreamConfigContent: () => Promise<string>
    fetchDirByUrl: (url: string) => Promise<string[]>
    streamPatch: (content: string) => void
}
