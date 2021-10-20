export interface ExecutorInterface {
    /**
     * 获取 nginx 配置参数
     * 1. 先从 cache 中查找
     * 2. 不存在, 则装配配置参数
     */
    getNginxConfigArgs: () => Promise<NginxConfig>
    /**
     * 获取 nginx prefix
     */
    getPrefix: () => Promise<string>

    /**
     * 获取 nginx 执行目录
     * 1. 首先查找 cache 中是否存在 sbin-path
     * 2. 其次查找本地 .env
     * 3. 最后使用 which nginx
     * 4. 如果都没找到, 抛出异常
     */
    getNginxBin: () => Promise<string>

    /**
     * 获取 nginx -V 结果
     */
    getNginxVersion: () => Promise<string>

    /**
     * 获取 nginx 主配置文件路径
     */
    getMainConfigPath: () => Promise<string>

    /**
     * 获取 nginx 主配置文件内容
     */
    getMainConfigContent: () => Promise<string>

    /**
     * 获取 stream 配置文件路径
     * 1. 如果目录下存在 uuid.conf 文件; 则返回, 如果存在多个, 则返回第一个
     * 2. 如果不存在, 则创建 uuid.conf 文件
     */
    getStreamConfigPath: () => Promise<string>

    /**
     * 获取 stream 配置文件路径
     */
    getStreamDirectory: () => Promise<string>

    /**
     * 获取 HTTP 配置文件路径
     */
    getHTTPConfigPath: () => Promise<string>

    /**
     * 获取 stream.conf 的内容
     */
    getStreamFileContent: () => Promise<string>

    /**
     * nginx 主配置尾部追加
     */
    mainConfigAppend: (appendString: string) => void

    /**
     * stream 配置替换
     */
    streamPatch: () => void
}

/**
 * 缓存处理过的 nginx -V 配置信息
 */
export interface NginxConfig {
    version: string
    args: { [key: string]: { label: string; value: string } }
    module: string[]
}
