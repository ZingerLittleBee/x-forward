import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse, Result } from '@x-forward/common'
import { EnvService } from './env.service'
import { NginxConfigVo, OverviewVo, SystemInfoVo } from './env.vo'

@ApiTags('env')
@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {}
    /**
     * 获取 nginx 配置
     * @returns Promise<{ success: boolean; data: NginxConfig; }>
     */
    @Get(':clientId/nginx')
    @ApiExtraModels(NginxConfigVo, OverviewVo, SystemInfoVo)
    @ApiResultResponse(NginxConfigVo)
    async getNginxConfig(@Param('clientId') clientId: string) {
        return Result.okData(await this.envService.fetchNginxConfigArgs(clientId))
    }
    // @Get('nginx/config/staream')
    // getNginxStreamConfig() {
    //     return Result.okData(await this.envService.)
    // }
    /**
     * get overview
     * @returns
     */
    @Get(':clientId/overview')
    @ApiResultResponse(OverviewVo)
    async getOverview(@Param('clientId') clientId: string) {
        return Result.okData(await this.envService.getOverview(clientId))
    }
    /**
     * 获取操作系统发型版本
     * @returns Promise<{success: boolean; data: String;}>
     */
    @Get(':clientId/os')
    @ApiResultResponse(SystemInfoVo)
    async getSystemInfo(@Param('clientId') clientId: string) {
        return Result.okData(await this.envService.getSystemInfo(clientId))
    }
    /**
     * 获取 url 路径下的文件夹
     * @param url 要获取的路径
     * @returns Promise<{ success: boolean; data: string[]; }>
     */
    @Get(':clientId/path')
    @ApiResultResponse('string', { isArray: true })
    async getDirectory(@Param('clientId') clientId: string, @Query('url') url: string) {
        return Result.okData(await this.envService.getDirByUrl(clientId, url))
    }
}
