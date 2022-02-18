export interface SystemInfo {
    hostname?: string
    kernelRelease?: string
    kernelVersion?: string
    hardware?: string
    distributorId?: string
    description?: string
    release?: string
    codename?: string
}

export interface ISystem {
    /**
     * get all directory under url
     */
    fetchDirectory(url: string): Promise<string>

    /**
     * nginx reload to make configuartion effect
     */
    nginxReload(): void

    /**
     * nginx restart
     */
    nginxRestart(): void

    /**
     * get system info
     */
    getSystemInfo(): Promise<SystemInfo>

    /**
     * get IP
     */
    getIp(): Promise<string>
}
