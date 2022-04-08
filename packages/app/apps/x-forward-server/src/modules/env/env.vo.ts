import { enumToString, getValuesOfEnum, NginxStatusEnum } from '@forwardx/shared'
import { ApiProperty } from '@nestjs/swagger'
import { NginxConfig, SystemInfo } from '@x-forward/executor'
import { Overview } from './env.interface'

export class SystemInfoVo implements SystemInfo {
    @ApiProperty({ description: 'hostname' })
    hostname?: string

    @ApiProperty({ description: 'kernel release' })
    kernelRelease?: string

    @ApiProperty({ description: 'kernel velease' })
    kernelVersion?: string

    @ApiProperty({ description: 'hardware name' })
    hardware?: string

    @ApiProperty({ description: 'distributorId' })
    distributorId?: string

    @ApiProperty({ description: 'description' })
    description?: string

    @ApiProperty({ description: 'release' })
    release?: string

    @ApiProperty({ description: 'codename' })
    codename?: string
}

export class OverviewVo implements Overview {
    @ApiProperty({ description: '操作系统信息' })
    os?: string

    @ApiProperty({ description: 'Nginx 路径' })
    nginxPath?: string

    @ApiProperty({ description: 'Nginx Uptime' })
    nginxUptime?: string

    @ApiProperty({
        enum: getValuesOfEnum(NginxStatusEnum),
        description: `Nginx 运行状态; ${enumToString(NginxStatusEnum)}`
    })
    nginxStatus?: NginxStatusEnum | string

    @ApiProperty({
        description: `系统时间`
    })
    systemTime?: string
}

export class NginxConfigVo implements NginxConfig {
    @ApiProperty({ description: 'nginx version' })
    version?: string

    @ApiProperty({ description: 'configuration args' })
    args?: { [key: string]: { label: string; value: string } }

    @ApiProperty({ description: 'nginx module' })
    module?: string[]
}
