import { removeInvalidField } from '@app/x-forward-common'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

/**
 * remove Invalid field that null or undefined from result
 */
@Injectable()
export class optimizeFieldInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map(next => removeInvalidField(next)))
    }
}
