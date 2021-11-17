export interface SystemInfo {
    uname?: {
        hostname?: string
        kernelRelease?: string
        kernelVersion?: string
        hardware?: string
    }
    lsb?: {
        distributorId?: string
        description?: string
        release?: string
        codename?: string
    }
}

export interface ISystem {
    /**
     * get all directory under url
     */
    fetchDirectory: (url: string) => Promise<string>

    /**
     * nginx reload to make configuartion effect
     */
    nginxReload: () => void

    /**
     * nginx restart
     */
    nginxRestart: () => void

    /**
     * get system info
     */
    getSystemInfo: () => Promise<SystemInfo>
}
