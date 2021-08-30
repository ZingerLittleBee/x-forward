import { Injectable } from '@nestjs/common';
import { exec } from '../../utils/bashUtil'

@Injectable()
export class EnvService {

  /**
   * if there is a nginx
   * @returns 
   */
  isExistNginx() {
    return exec('ls -a')
  }
}
