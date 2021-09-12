import { Injectable } from '@nestjs/common'
import { findSomething } from '../../utils/BashUtil'
const os = require('os')
import { $ } from 'zx'
import { OverviewVO } from './env.vo'
import StatusEnum from 'src/enums/StatusEnum'
import { checkOS, fetchDirectory } from 'src/utils/Shell'

@Injectable()
export class EnvService {

    /**
     * if there is a nginx
     * @returns
     */
    getNginxPath() {
        return findSomething('nginx')
    }

    handlerMsg(msg: string) {
        
    }

    async getOS() {
        return await checkOS()
        // return (await $`cat /etc/*release | grep -E ^NAME`).stdout.replace(/NAME="|"|\n/g, '') + ' ' + os.release()
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

    getDirByUrl(url: string) {
        // add "/" automatic if url no "/" at the beginning
        if (!url.match(/^\//)) {
            url = '/' + url
        }
        return fetchDirectory(url)
    }
}
