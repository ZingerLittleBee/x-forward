// 启用状态
export enum StreamStatusEnum {
    Running,
    Stop
}

export enum StreamItemEnum {
    TransitHost = '中转地址',
    // 中转端口号
    TransitPort = '中转端口',
    // 远程 ip/域名
    RemoteHost = '远程地址',
    // 远程端口号
    RemotePort = '远程端口',
    RemoteRule = '转发规则',
    // tcp or udp
    Protocol = '转发协议',
    Status = '联通状态',
    IsRetries = '失败重试',
    Tries = '重试次数',
    RetriesTimeout = '重试超时时间',
    ConnectTimeout = '连接超时时间',
    UploadRate = '上传速率',
    DownloadRate = '下载速率',
    ProxyTimeout = '存活时间',
    // 上游服务
    Upstream = '上游服务',
    // 启用状态
    State = '启用状态',
    // 负载均衡算法
    LoadBalancing = '负载算法',
    // 创建时间
    CreateTime = '创建时间',
    // 更新时间
    UpdatedTime = '更新时间',
    // 备注
    Comment = '备注说明'
}

export enum StreamTipsEnum {
    UploadRate = '从客户端读数据的速率，单位为每秒字节数，默认为0，不限速',
    DownloadRate = '从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速',
    ProxyTimeout = '配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟'
}
