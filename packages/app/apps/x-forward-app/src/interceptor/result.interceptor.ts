import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { removeInvalidField } from '../utils/object.util'

/**
 * remove Invalid field that null or undefined from result
 */
@Injectable()
export class optimizeFieldInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map(next => removeInvalidField(next)))
    }
}
