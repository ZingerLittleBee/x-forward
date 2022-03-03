import { IResult } from '@x-forward/common'
import { Observable } from 'rxjs'
import { NginxConfig } from '@x-forward/executor'

export interface GrpcExecutorService {
    getNginxBin(): Observable<IResult<string>>
    rewriteMainConfig(content: string): Observable<any>
    getNginxConfigArgs(): Observable<NginxConfig>
}
