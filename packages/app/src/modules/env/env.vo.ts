import { ApiProperty } from '@nestjs/swagger'
import { StatusEnum } from 'src/enums/StatusEnum'
import { NginxConfig } from '../executor/interfaces/nginx-config.interface'
import { SystemInfo } from '../executor/interfaces/system.interface'
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

    @ApiProperty({ description: 'Nginx Upstream' })
    nginxUptime?: string

    @ApiProperty({
        enum: ['0, 1, 2, 3, 4'],
        description: `Nginx 运行状态; ${StatusEnum.Running}: Running, ${StatusEnum.Checking}: Checking, ${StatusEnum.Stop}: Stop, ${StatusEnum.NotInstall}: NotInstall, ${StatusEnum.Error}: Error`
    })
    nginxStatus?: StatusEnum | string
}

export class NginxConfigVo implements NginxConfig {
    @ApiProperty({ description: 'nginx version' })
    version?: string

    @ApiProperty({ description: 'configuration args' })
    args?: { [key: string]: { label: string; value: string } }

    @ApiProperty({ description: 'nginx module' })
    module?: string[]
}
