import { NginxLoadBalancingEnum, ProtocolEnum } from '../../enums/NginxEnum'

// 为了配置项的一目了然, 这里还是遵循 nginx 的下划线写法吧
export interface StreamServer {
    protocol?: ProtocolEnum
    listen_port: number
    // 失败重试
    proxy_next_upstream?: 'on' | 'off'
    proxy_next_upstream_timeout?: string
    proxy_next_upstream_tries?: number
    // 超时配置, 配置与上游服务器连接超时时间，默认60s
    proxy_connect_timeout?: string
    // 限速配置
    // 从客户端读数据的速率，单位为每秒字节数，默认为0，不限速
    proxy_upload_rate?: number
    // 从上游服务器读数据的速率，单位为每秒字节数，默认为0，不限速
    proxy_download_rate?: number
    // 配置与客户端上游服务器连接的两次成功读/写操作的超时时间，如果超时，将自动断开连接, 即连接存活时间，通过它可以释放不活跃的连接，默认10分钟
    proxy_timeout?: string
    proxy_pass: string
}

export interface StreamUpstream {
    name: string
    load_balancing?: NginxLoadBalancingEnum
    server: UpstreamServer[]
}

export interface UpstreamServer {
    upstream_host: string
    upstream_port: number
    // 设置服务器的权重，默认情况下为 1。
    weight?: number
    // 限制到被代理服务器的最大同时连接数（1.11.5）。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效。
    max_conns?: number
    // 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时。
    max_fails?: number
    // 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10 秒。
    fail_timeout?: string
    // 将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器。
    // 该参数不能与 hash 和 random 负载均衡算法一起使用。
    backup?: 'backup'
    // 将服务器标记为永久不可用。
    down?: 'down'
}

export interface RenderModel {
    servers?: StreamServer[]
    upstreams?: StreamUpstream[]
}
