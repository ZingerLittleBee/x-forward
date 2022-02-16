declare namespace API {
    type StreamEntity = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 远程地址 */
        remoteHost?: string
        /** 远程端口 */
        remotePort?: number
        /** 联通状态, Running: 0,Checking: 1,Stop: 2,NotInstall: 3,Error: 4,0: Running,1: Checking,2: Stop,3: NotInstall,4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
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
        /** 上传速率, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        uploadRate?: string
        /** 下载速率, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        downloadRate?: string
        /** 存活时间, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注说明 */
        comment?: string
        upstreamId?: string
    }

    type ServerEntity = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 上游地址 */
        upstreamHost: string
        /** 上游端口 */
        upstreamPort: number
        /** 权重, 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 最大连接数, 限制到被代理服务器的最大同时连接数。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 最大尝试次数, 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s */
        failTimeout?: string
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s, False: 0,True: 1,0: False,1: True */
        backup?: 0 | 1
        /** 不可用, 将服务器标记为永久不可用, False: 0,True: 1,0: False,1: True */
        down?: 0 | 1
        upstreamId?: string
    }

    type UpstreamEntity = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** upstream_name */
        name: string
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
        stream?: StreamEntity[]
        server: ServerEntity[]
    }

    type CreateServerDto = {
        /** 上游地址 */
        upstreamHost: string
        /** 上游端口 */
        upstreamPort: number
        /** 权重, 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 最大连接数, 限制到被代理服务器的最大同时连接数。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 最大尝试次数, 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s */
        failTimeout?: string
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s, False: 0,True: 1,0: False,1: True */
        backup?: 0 | 1
        /** 不可用, 将服务器标记为永久不可用, False: 0,True: 1,0: False,1: True */
        down?: 0 | 1
    }

    type UpdateServerDto = {
        /** 上游地址 */
        upstreamHost?: string
        /** 上游端口 */
        upstreamPort?: number
        /** 权重, 设置服务器的权重，默认情况下为 1 */
        weight?: number
        /** 最大连接数, 限制到被代理服务器的最大同时连接数。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
        maxCons?: number
        /** 最大尝试次数, 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
        maxFails?: number
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s */
        failTimeout?: string
        /** 失败超时时间, 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s, False: 0,True: 1,0: False,1: True */
        backup?: 0 | 1
        /** 不可用, 将服务器标记为永久不可用, False: 0,True: 1,0: False,1: True */
        down?: 0 | 1
        id: string
    }

    type UpstreamVo = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** upstream_name */
        name?: string
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
        stream?: StreamEntity[]
        server?: ServerEntity[]
    }

    type CreateStreamDto = {
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 远程地址 */
        remoteHost?: string
        /** 远程端口 */
        remotePort?: number
        /** 联通状态, Running: 0,Checking: 1,Stop: 2,NotInstall: 3,Error: 4,0: Running,1: Checking,2: Stop,3: NotInstall,4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
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
        /** 上传速率, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        uploadRate?: string
        /** 下载速率, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        downloadRate?: string
        /** 存活时间, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注说明 */
        comment?: string
        upstreamId?: string
    }

    type CreateUpstreamDto = {
        /** upstream_name */
        name: string
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
        stream: CreateStreamDto[]
        server: CreateServerDto[]
    }

    type UpdateStreamDto = {
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 远程地址 */
        remoteHost?: string
        /** 远程端口 */
        remotePort?: number
        /** 联通状态, Running: 0,Checking: 1,Stop: 2,NotInstall: 3,Error: 4,0: Running,1: Checking,2: Stop,3: NotInstall,4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
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
        /** 上传速率, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        uploadRate?: string
        /** 下载速率, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        downloadRate?: string
        /** 存活时间, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注说明 */
        comment?: string
        upstreamId?: string
    }

    type UpdateUpstreamDto = {
        /** upstream_name */
        name: string
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
        stream?: UpdateStreamDto[]
        server: UpdateServerDto[]
    }

    type StreamVo = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 远程地址 */
        remoteHost?: string
        /** 远程端口 */
        remotePort?: number
        /** 联通状态, Running: 0,Checking: 1,Stop: 2,NotInstall: 3,Error: 4,0: Running,1: Checking,2: Stop,3: NotInstall,4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
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
        /** 上传速率, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        uploadRate?: string
        /** 下载速率, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        downloadRate?: string
        /** 存活时间, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注说明 */
        comment?: string
        upstreamId?: string
    }

    type StreamDto = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        /** 中转地址 */
        transitHost?: string
        /** 中转端口 */
        transitPort?: number
        /** 远程地址 */
        remoteHost?: string
        /** 远程端口 */
        remotePort?: number
        /** 联通状态, Running: 0,Checking: 1,Stop: 2,NotInstall: 3,Error: 4,0: Running,1: Checking,2: Stop,3: NotInstall,4: Error */
        status?: 0 | 1 | 2 | 3 | 4
        /** 负载算法, Random: 0,Weight: 1,Hash: 2,Least_conn: 3,0: Random,1: Weight,2: Hash,3: Least_conn */
        loadBalancing?: 0 | 1 | 2 | 3
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
        /** 上传速率, 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        uploadRate?: string
        /** 下载速率, 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速, 单位为字节每秒, 例如 100k */
        downloadRate?: string
        /** 存活时间, 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟 */
        proxyTimeout?: string
        /** 备注说明 */
        comment?: string
        upstreamId?: string
    }

    type UserVo = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 用户名 */
        username?: string
        /** 密码 */
        password?: string
        /** 角色, 用户名: Username,密码: Password,角色: Role,备注: Comment */
        role?: 'User' | 'Admin'
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
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        /** 用户名 */
        username: string
        /** 密码 */
        password: string
        /** 角色, 用户名: Username,密码: Password,角色: Role,备注: Comment */
        role: 'User' | 'Admin'
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
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
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

    type ClientEntity = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        ip?: string
        domain?: string
        /** False: 0,True: 1,0: False,1: True */
        isOnline?: 0 | 1
        lastCommunicationTime?: string
    }

    type ClientVo = {
        id?: string
        ip?: string
        domain?: string
    }

    type CreateClientDto = {
        id?: string
        /** 是否生效; Able: 0,Disable: 1,0: Able,1: Disable */
        state?: 0 | 1
        createTime?: string
        updateTime?: string
        deleteTime?: string
        ip?: string
        domain?: string
        /** False: 0,True: 1,0: False,1: True */
        isOnline?: 0 | 1
        lastCommunicationTime?: string
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

    type ServerControllerRemoveParams = {
        id: string
    }

    type ServerControllerPatchParams = {
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

    type ClientControllerGetByIdParams = {
        id: string
    }
}
