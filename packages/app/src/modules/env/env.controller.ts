import { Controller, Get, Query } from '@nestjs/common'
import { Result } from '../../utils/Result'
import { EnvService, NginxConfig } from './env.service'

@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {}

    @Get('test')
    async getCache() {
        await this.envService.getNginxCache()
    }

    /**
     * 获取 nginx 配置
     * @returns Promise<{ success: boolean; data: NginxConfig; }>
     */
    @Get('nginx/config')
    async getNginxConfig() {
        return new Result<NginxConfig>().okWithData(
            this.envService.fetchNginxConfigAargs(
                await this.envService.fetchNginxConfig()
            )
        )
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
        const res = await this.envService.getDirByUrl(url)
        return new Result<string[]>().okWithData(
            res.split('\n').filter(r => r !== '')
        )
    }
}
