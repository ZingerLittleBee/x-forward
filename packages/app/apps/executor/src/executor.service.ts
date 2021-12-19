import { Injectable } from '@nestjs/common'

@Injectable()
export class ExecutorService {
    getHello(): string {
        return 'Hello World!'
    }
}
