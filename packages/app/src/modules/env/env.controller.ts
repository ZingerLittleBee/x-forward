import { Controller, Get } from '@nestjs/common';
import { EnvService } from './env.service';
import { Result } from 'src/utils/Result';

@Controller('env')
export class EnvController {
  constructor(private envService: EnvService) {}

  @Get('nginx')
  async findNginx() {
    let res = await this.envService.isExistNginx()
    return res ? new Result<string>().okWithData(res) : Result.noWithMsg('nginx 未找到')
  }
}
