import { Controller, Get, Post, Query, Res } from '@nestjs/common'
import { EnvService } from './env.service'
import { Result } from 'src/utils/Result'
import { OverviewVO } from './env.vo'

@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {}

    @Get('nginx')
    getOverview() {
        return new Result<OverviewVO>().okWithData({
            os: 'Debian GNU/Linux 10',
            nginxPath: '/usr/local/nginx',
            nginxUptime: '20d:10h:20m:10s',
            nginxStatus: 0
        })
    }

    @Get('os')
    getOS() {
        return this.envService.getOS()
    }
}
