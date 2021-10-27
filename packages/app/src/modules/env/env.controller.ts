import { Controller, Get, Query } from '@nestjs/common'
import { Result } from '../../utils/Result'
import { NginxConfig } from '../executor/interface/executor.interface'
import { EnvService } from './env.service'

@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {}

    /**
     * 获取 nginx 配置
     * @returns Promise<{ success: boolean; data: NginxConfig; }>
     */
    @Get('nginx/config')
    async getNginxConfig() {
        console.log('fetchNginxConfigAargs()', await this.envService.fetchNginxConfigAargs())
        return new Result<NginxConfig>().okWithData(await this.envService.fetchNginxConfigAargs())
    }

    @Get('nginx/config/staream')
    getNginxStreamConfig() {}

    /**
     * 获取 nginx 概览
     * @returns
     */
    @Get('nginx')
    async getOverview() {
        let res = await this.envService.getOverview()
        return new Result<typeof res>().okWithData(res)
    }

    /**
     * 获取操作系统发型版本
     * @returns Promise<{success: boolean; data: String;}>
     */
    @Get('os')
    async getOS() {
        return new Result<String>().okWithData(await this.envService.getOS())
    }

    /**
     * 获取 url 路径下的文件夹
     * @param url 要获取的路径
     * @returns Promise<{ success: boolean; data: string[]; }>
     */
    @Get('path')
    async getDirectory(@Query('url') url: string) {
        return Result.okData(await this.envService.getDirByUrl(url))
    }
}
