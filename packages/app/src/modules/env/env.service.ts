import { Injectable } from '@nestjs/common'
import { StatusEnum } from 'src/enums/StatusEnum'
import { findSomething } from '../../utils/BashUtil'
import { checkOS } from '../../utils/Shell'
import { ExecutorService } from '../executor/executor.service'
import { NginxConfig } from '../executor/interface/executor.interface'

@Injectable()
export class EnvService {
    constructor(private executorService: ExecutorService) {}

    async fetchNginxConfigAargs(): Promise<NginxConfig> {
        return this.executorService.getNginxConfigAargs()
    }

    /**
     * if there is a nginx
     * @returns
     */
    getNginxPath() {
        return findSomething('nginx')
    }

    async getOS() {
        return await checkOS()
    }

    getNginxStatus() {}

    getNginxUptime() {}

    async getOverview() {
        let os = await this.getOS()
        let nginxPath = await this.getNginxPath()
        let nginxUptime
        let nginxStatus
        if (!nginxPath) {
            nginxStatus = StatusEnum.NotInstall
            nginxUptime = '0'
        } else {
        }
        return {
            os,
            nginxPath,
            nginxUptime,
            nginxStatus
        }
    }

    /**
     * 获取指定路径下的所有文件夹
     * @param url 路径
     * @returns 路径下的所有文件夹
     */
    async getDirByUrl(url: string) {
        // // add "/" automatic if url no "/" at the beginning
        // if (!url.match(/^\//)) {
        //     url = '/' + url
        // }
        // return fetchDirectory(url)
        return this.executorService.getDirByUrl(url)
    }

    /**
     * 获取 nginx HTTP 文件
     */
    fetchNginxHTTPFile() {
        this.executorService.getNginxMainConfigContent()
    }

    /**
     * 获取 nginx stream 文件
     */
    fetchNginxStreamFile() {
        this.executorService.getNginxStreamConfigContent()
    }
}
