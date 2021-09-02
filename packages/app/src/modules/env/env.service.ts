import { Injectable } from '@nestjs/common'
import { findSomething } from '../../utils/bashUtil'
import { installNginx } from './shell'
const os = require('os')
import { $ } from 'zx'

@Injectable()
export class EnvService {
  /**
   * if there is a nginx
   * @returns
   */
  isExistNginx() {
    return findSomething('nginx')
  }

  async installNginx(version: string) {
    installNginx(version)
  }

  async getOS() {
    return (await $`cat /etc/*release | grep -E ^NAME`).stdout + os.release()
  }
}
