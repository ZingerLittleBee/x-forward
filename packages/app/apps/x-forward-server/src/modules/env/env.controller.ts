import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('env')
@Controller('env')
export class EnvController {
    // constructor(private envService: EnvService) {}
    // /**
    //  * 获取 nginx 配置
    //  * @returns Promise<{ success: boolean; data: NginxConfig; }>
    //  */
    // @Get('nginx/config')
    // @ApiExtraModels(NginxConfigVo, OverviewVo, SystemInfoVo)
    // @ApiResultResponse(NginxConfigVo)
    // async getNginxConfig() {
    //     return Result.okData(await this.envService.fetchNginxConfigArgs())
    // }
    // // @Get('nginx/config/staream')
    // // getNginxStreamConfig() {
    // //     return Result.okData(await this.envService.)
    // // }
    // /**
    //  * get overview
    //  * @returns
    //  */
    // @Get('nginx')
    // @ApiResultResponse(OverviewVo)
    // async getOverview() {
    //     return Result.okData(await this.envService.getOverview())
    // }
    // /**
    //  * 获取操作系统发型版本
    //  * @returns Promise<{success: boolean; data: String;}>
    //  */
    // @Get('os')
    // @ApiResultResponse(SystemInfoVo)
    // async getSystemInfo() {
    //     return Result.okData(await this.envService.getSystemInfo())
    // }
    // /**
    //  * 获取 url 路径下的文件夹
    //  * @param url 要获取的路径
    //  * @returns Promise<{ success: boolean; data: string[]; }>
    //  */
    // @Get('path')
    // @ApiResultResponse('string', { isArray: true })
    // async getDirectory(@Query('url') url: string) {
    //     return Result.okData(await this.envService.getDirByUrl(url))
    // }
}
