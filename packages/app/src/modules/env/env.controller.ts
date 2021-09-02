import { Controller, Get, Post, Query, Res } from '@nestjs/common';
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

  @Post('nginx')
  installNginx(@Query('version') version: string) {
    this.envService.installNginx(version)
  }

  @Get('os')
  getOS() {
    return this.envService.getOS()
  }

}
