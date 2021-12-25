declare namespace API {
    type StreamEntity = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 上游地址 */
        remoteHost?: string
        /** 上游端口 */
        remotePort?: number
        /** 联通状态, 1: Checking, 0: Running, 2: Stop, 3: NotInstall, 4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        /** 转发协议 */
        protocol?: 'tcp' | 'udp'
        /** 失败重试 */
        isRetries?: 'on' | 'off'
        /** 重试次数 */
        tries?: number
        /** 重试超时时间 */
        retriesTimeout?: string
        /** 连接超时时间 */
        connectTimeout?: string
        /** 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速 */
        uploadRate?: string
        /** 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速 */
        downloadRate?: string
        /** 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注 */
        comment?: string
        upstreamId?: string
    }

    type ServerEntity = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 上游地址 */
        upstreamHost: string
        /** 上游端口 */
        upstreamPort: number
        /** 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 限制到被代理服务器的最大同时连接数（1.11.5）。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10 秒 */
        failTimeout?: string
        /** 将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器; 该参数不能与 hash 和 random 负载均衡算法一起使用; 0: false, 1: true */
        backup?: 0 | 1
        /** 将服务器标记为永久不可用; 0: false, 1: true */
        down?: 0 | 1
        upstream?: UpstreamEntity
    }

    type UpstreamEntity = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** upstream_name */
        name: string
        /** 负载均衡算法; 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        stream?: StreamEntity[]
        server: ServerEntity[]
    }

    type CreateServerDto = {
        /** 上游地址 */
        upstreamHost: string
        /** 上游端口 */
        upstreamPort: number
        /** 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 限制到被代理服务器的最大同时连接数（1.11.5）。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10 秒 */
        failTimeout?: string
        /** 将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器; 该参数不能与 hash 和 random 负载均衡算法一起使用; 0: false, 1: true */
        backup?: 0 | 1
        /** 将服务器标记为永久不可用; 0: false, 1: true */
        down?: 0 | 1
    }

    type UpdateServerDto = {
        /** 上游地址 */
        upstreamHost?: string
        /** 上游端口 */
        upstreamPort?: number
        /** 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 限制到被代理服务器的最大同时连接数（1.11.5）。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10 秒 */
        failTimeout?: string
        /** 将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器; 该参数不能与 hash 和 random 负载均衡算法一起使用; 0: false, 1: true */
        backup?: 0 | 1
        /** 将服务器标记为永久不可用; 0: false, 1: true */
        down?: 0 | 1
        id: string
    }

    type UpstreamVo = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** upstream_name */
        name?: string
        /** 负载均衡算法; 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        stream?: StreamEntity[]
        server?: ServerEntity[]
    }

    type CreateStreamDto = {
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 上游地址 */
        remoteHost?: string
        /** 上游端口 */
        remotePort?: number
        /** 联通状态, 1: Checking, 0: Running, 2: Stop, 3: NotInstall, 4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        /** 转发协议 */
        protocol?: 'tcp' | 'udp'
        /** 失败重试 */
        isRetries?: 'on' | 'off'
        /** 重试次数 */
        tries?: number
        /** 重试超时时间 */
        retriesTimeout?: string
        /** 连接超时时间 */
        connectTimeout?: string
        /** 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速 */
        uploadRate?: string
        /** 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速 */
        downloadRate?: string
        /** 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注 */
        comment?: string
        upstreamId?: string
    }

    type CreateUpstreamDto = {
        /** upstream_name */
        name: string
        /** 负载均衡算法; 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        stream: CreateStreamDto[]
        server: CreateServerDto[]
    }

    type UpdateStreamDto = {
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 上游地址 */
        remoteHost?: string
        /** 上游端口 */
        remotePort?: number
        /** 联通状态, 1: Checking, 0: Running, 2: Stop, 3: NotInstall, 4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        /** 转发协议 */
        protocol?: 'tcp' | 'udp'
        /** 失败重试 */
        isRetries?: 'on' | 'off'
        /** 重试次数 */
        tries?: number
        /** 重试超时时间 */
        retriesTimeout?: string
        /** 连接超时时间 */
        connectTimeout?: string
        /** 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速 */
        uploadRate?: string
        /** 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速 */
        downloadRate?: string
        /** 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注 */
        comment?: string
        upstreamId?: string
    }

    type UpdateUpstreamDto = {
        /** upstream_name */
        name: string
        /** 负载均衡算法; 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        stream?: UpdateStreamDto[]
        server: UpdateServerDto[]
    }

    type StreamVo = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 上游地址 */
        remoteHost?: string
        /** 上游端口 */
        remotePort?: number
        /** 联通状态, 1: Checking, 0: Running, 2: Stop, 3: NotInstall, 4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        /** 转发协议 */
        protocol?: 'tcp' | 'udp'
        /** 失败重试 */
        isRetries?: 'on' | 'off'
        /** 重试次数 */
        tries?: number
        /** 重试超时时间 */
        retriesTimeout?: string
        /** 连接超时时间 */
        connectTimeout?: string
        /** 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速 */
        uploadRate?: string
        /** 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速 */
        downloadRate?: string
        /** 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注 */
        comment?: string
        upstreamId?: string
    }

    type StreamDto = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 上游地址 */
        remoteHost?: string
        /** 上游端口 */
        remotePort?: number
        /** 联通状态, 1: Checking, 0: Running, 2: Stop, 3: NotInstall, 4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载均衡算法, 0: poll, 1: weight, 2: ip_hash, 3: fair, 4: url_hash */
        loadBalancing?: 0 | 1 | 2 | 3 | 4
        /** 转发协议 */
        protocol?: 'tcp' | 'udp'
        /** 失败重试 */
        isRetries?: 'on' | 'off'
        /** 重试次数 */
        tries?: number
        /** 重试超时时间 */
        retriesTimeout?: string
        /** 连接超时时间 */
        connectTimeout?: string
        /** 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速 */
        uploadRate?: string
        /** 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速 */
        downloadRate?: string
        /** 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注 */
        comment?: string
        upstreamId?: string
    }

    type UserVo = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 用户名 */
        username?: string
        /** 密码 */
        password?: string
        /** 备注 */
        comment?: string
    }

    type Result = {
        /** 请求是否成功 */
        success: boolean
        /** 提示信息 */
        message: string
        data: Record<string, any>
    }

    type UserEntity = {
        id?: string
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 用户名 */
        username: string
        /** 密码 */
        password: string
        /** 备注 */
        comment?: string
    }

    type LoginUserDto = {
        /** 用户名 */
        username: string
        /** 密码 */
        password: string
    }

    type CreateUserDto = {
        /** 是否生效; 0: able, 1: disable */
        state?: 0 | 1
        /** 用户名 */
        username: string
        /** 密码 */
        password: string
        /** 备注 */
        comment?: string
    }

    type NginxConfigVo = {
        /** nginx version */
        version: string
        /** configuration args */
        args: Record<string, any>
        /** nginx module */
        module: string[]
    }

    type OverviewVo = {
        /** 操作系统信息 */
        os: string
        /** Nginx 路径 */
        nginxPath: string
        /** Nginx Upstream */
        nginxUptime: string
        /** Nginx 运行状态; 0: Running, 1: Checking, 2: Stop, 3: NotInstall, 4: Error */
        nginxStatus: '0, 1, 2, 3, 4'
    }

    type SystemInfoVo = {
        /** hostname */
        hostname: string
        /** kernel release */
        kernelRelease: string
        /** kernel velease */
        kernelVersion: string
        /** hardware name */
        hardware: string
        /** distributorId */
        distributorId: string
        /** description */
        description: string
        /** release */
        release: string
        /** codename */
        codename: string
    }

    type UpstreamControllerFindOneParams = {
        id: string
    }

    type UpstreamControllerRemoveParams = {
        id: string
    }

    type UpstreamControllerUpdateParams = {
        id: string
    }

    type StreamControllerUpdateStateByIdParams = {
        id: string
    }

    type StreamControllerUpdateUpstreamIdByIdParams = {
        id: string
    }

    type StreamControllerDeleteParams = {
        id: string
    }

    type StreamControllerUpdateStreamByIdParams = {
        id: string
    }

    type UserControllerDeleteParams = {
        id: string
    }

    type EnvControllerGetDirectoryParams = {
        url: string
    }
}
