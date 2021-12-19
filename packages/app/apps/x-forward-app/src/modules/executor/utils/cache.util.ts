import { NginxConfigArgsReflectEnum } from 'apps/x-forward-app/src/enums/NginxEnum'
import { Cache } from 'cache-manager'
import { EnvEnum } from '../../../enums/EnvEnum'
import { NginxConfig } from '../interfaces/nginx-config.interface'

/**
 * 获取 cache 中的 nginxConfig
 * @returns NginxConfig
 */
export const getNginxCache = async (cacheManager: Cache) => {
    return cacheManager.get<NginxConfig>(EnvEnum.NGINX_CONFIG_ARGS)
}

/**
 * 匹配 nginx -V 结果
 * @param info nginx -V 结果
 */
export const fetchNginxConfigArgs = (nginxInfo: string, cacheManager: Cache): NginxConfig => {
    // 获取 nginx 版本号
    const version = nginxInfo.match(/nginx\/\d.*/)[0]

    // 获取模块配置
    let moduleConfig = nginxInfo.match(/with[-\w]+/g)
    moduleConfig = moduleConfig.filter(m => m !== 'with-ld-opt' && m !== 'with-cc-opt')

    // 获取键值对配置项
    // 1. 处理特殊情况(内容包含空格)
    //  --with-ld-opt='-Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie'
    //  --with-cc-opt='-g -O2 -fdebug-prefix-map=/data/builder/debuild/nginx-1.21.3/debian/debuild-base/nginx-1.21.3=. -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC'
    const spaceRegExp = /(with-ld-opt|with-cc-opt)='.*?'/g
    const opt = nginxInfo.match(spaceRegExp)
    let argsConfig: string[]
    // 2. 处理一般情况(内容不带空格)
    if (opt) {
        // 如果 --with-ld-opt 存在, 则合并结果
        argsConfig = nginxInfo
            .replace(spaceRegExp, '')
            .match(/([a-z][-\w]+)=(\S+)/gi)
            .concat(opt)
    } else {
        argsConfig = nginxInfo.match(/([a-z][-\w]+)=(\S+)/gi)
    }
    // 3. [ 'prefix=/etc/nginx' ] 键值对分离
    const argsConfigObj = {}
    argsConfig.forEach(p => {
        const matchTemp = p.match(/([-_a-z]+)(?:=)(.*)/i)
        argsConfigObj[matchTemp[1]] = {
            label: NginxConfigArgsReflectEnum[matchTemp[1]],
            value: matchTemp[2]
        }
    })
    return {
        version,
        args: argsConfigObj,
        module: moduleConfig
    }
}
