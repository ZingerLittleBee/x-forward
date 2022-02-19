import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable, of } from 'rxjs'
import { EnvKeyEnum, getEnvSetting, Result } from '@x-forward/common'

@Injectable()
export class CommunicationKeyAuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        if (request.get(EnvKeyEnum.CommunicationKey) !== getEnvSetting(EnvKeyEnum.CommunicationKey)) {
            return of(Result.noWithMsg('CommunicationKey 校验失败'))
        }
        return next.handle()
    }
}
