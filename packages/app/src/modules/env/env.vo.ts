import { ApiProperty } from '@nestjs/swagger'
import { StatusEnum } from 'src/enums/StatusEnum'

export class OverviewVO {
    @ApiProperty({ description: '操作系统信息' })
    os?: string

    @ApiProperty({ description: 'Nginx 路径' })
    nginxPath?: string

    @ApiProperty({ description: 'Nginx Upstream' })
    nginxUptime?: string

    @ApiProperty({
        enum: ['0, 1, 2, 3, 4'],
        description: `Nginx 运行状态; ${StatusEnum.Running}: Running, ${StatusEnum.Checking}: Checking, ${StatusEnum.Stop}: Stop, ${StatusEnum.NotInstall}: NotInstall, ${StatusEnum.Error}: Error`
    })
    nginxStatus?: StatusEnum
}
