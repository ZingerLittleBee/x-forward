// 启用状态
export enum StreamStatusEnum {
    Running,
    Stop
}

export enum StreamItemEnum {
    transitHost = '中转地址',
    // 中转端口号
    transitPort = '中转端口',
    // 远程 ip/域名
    remoteHost = '远程地址',
    // 远程端口号
    remotePort = '远程端口',
    remoteRule = '转发规则',
    // 上游服务
    upstream = '上游服务',
    // 启用状态
    state = '启用状态',
    // 负载均衡算法
    loadBalancing = '负载算法',
    // 创建时间
    createTime = '创建时间',
    // 更新时间
    updatedTime = '更新时间',
    // 备注
    comment = '备注说明'
}
