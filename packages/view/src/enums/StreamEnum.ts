// 启用状态
enum StreamStatusEnum {
    Running,
    Stop
}

// 负载均衡算法 https://juejin.cn/post/6844904144667590670#heading-11
enum loadBalancingEnum {
    // 轮询
    poll,
    // 加权
    weight,
    // ip_hash
    ip_hash,
    // 动态调度
    fair,
    // url_hash
    url_hash
}

enum StreamItemEnum {
    transitHost = '中转地址',
    // 中转端口号
    transitPort = '中转端口',
    // 远程 ip/域名
    remoteHost = '远程地址',
    // 远程端口号
    remotePort = '远程端口',
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

export { StreamStatusEnum, loadBalancingEnum, StreamItemEnum }
