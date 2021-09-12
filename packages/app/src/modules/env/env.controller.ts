import { Controller, Get, Post, Query, Res } from '@nestjs/common'
import { EnvService } from './env.service'
import { Result } from 'src/utils/Result'
import { OverviewVO } from './env.vo'

@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {}

    @Get('nginx')
    async getOverview() {
        let res = await this.envService.getOverview()
        return new Result().okWithData(res)
    }

    @Get('os')
    getOS() {
        return this.envService.getOS()
    }

    @Get('path')
    async getDirectory(@Query('url') url: string) {
        const res = await this.envService.getDirByUrl(url)
        return new Result<string[]>().okWithData(res.split('\n').filter(r => r !== ''))
    }
}
