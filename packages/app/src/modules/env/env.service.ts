import { Injectable } from '@nestjs/common'
import { findSomething } from '../../utils/bashUtil'

@Injectable()
export class EnvService {

  /**
   * if there is a nginx
   * @returns 
   */
  isExistNginx() {
    return findSomething('nginx')
  }
}
