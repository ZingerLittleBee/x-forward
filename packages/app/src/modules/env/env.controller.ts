import { Controller, Get } from '@nestjs/common';
import { EnvService } from './env.service';

@Controller('env')
export class EnvController {
  constructor(private envService: EnvService) {}

  @Get('')
  async test() {
    const res = await this.envService.isExistNginx()
    console.log('res', res)
    return res
  }
}
