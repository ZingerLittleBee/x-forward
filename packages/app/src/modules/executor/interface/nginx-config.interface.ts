/**
 * 缓存处理过的 nginx -V 配置信息结构体
 */
export interface NginxConfig {
    version?: string
    args?: { [key: string]: { label: string; value: string } }
    module?: string[]
}
