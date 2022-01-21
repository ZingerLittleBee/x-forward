export enum ServerEnum {
    UpstreamName = '上游名称',
    UpstreamHost = '上游地址',
    UpstreamPort = '上游端口',
    LoadBalancing = '负载算法',
    Weight = '权重',
    MaxCons = '最大连接数',
    MaxFails = '最大尝试次数',
    FailTimeout = '失败超时时间',
    Backup = '备用服务器',
    Down = '不可用'
}

export enum ServerTipsEnum {
    Weight = '设置服务器的权重，默认情况下为 1',
    MaxCons = '限制到被代理服务器的最大同时连接数。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效',
    MaxFails = '设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时',
    FailTimeout = '在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10s',
    Backup = '将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器; 该参数不能与 hash 和 random 负载均衡算法一起使用',
    Down = '将服务器标记为永久不可用'
}
