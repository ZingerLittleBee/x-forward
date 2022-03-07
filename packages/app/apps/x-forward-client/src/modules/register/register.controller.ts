import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { Result, UserProperty } from '@x-forward/common'
import { RegisterService } from './register.service'

@Controller()
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @GrpcMethod('ExecutorService')
    updatePortAndUserRelation(args: { userProperties: UserProperty[] }) {
        this.registerService.setUserProperty(args?.userProperties)
        return Result.ok()
    }
}
