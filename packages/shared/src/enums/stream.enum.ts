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
