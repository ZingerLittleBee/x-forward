import { IResult } from '@x-forward/common'
import { Observable } from 'rxjs'

export interface GrpcNginxConfig {
    version?: string
    args: string
    // args?: { [key: string]: { label: string; value: string } }
    module?: string[]
}

export interface GrpcExecutorService {
    getNginxBin({}): Observable<IResult<string>>
    getNginxConfigArgs({}): Observable<IResult<GrpcNginxConfig>>
    rewriteMainConfig(arg: { content: string }): Observable<IResult<any>>
    streamPatch(arg: { content: string }): Observable<IResult<any>>
    getNginxStreamConfigContent({}): Observable<IResult<string>>
    fetchDirectory(arg: { url: string }): Observable<IResult<string>>
}
