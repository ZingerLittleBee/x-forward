import { resolveAny } from 'dns/promises'
import { EnvEnum } from 'src/enums/EnvEnum'
import { getEnvSetting } from 'src/utils/env.util'
import { RenderModel } from './render.interface'

const dnsCheck = ({ servers, upstreams }: RenderModel) => {
    console.log('DNS_SERVERS', getEnvSetting(EnvEnum.DNS_SERVERS))
    const parseMap = new Map()
    servers = servers.filter(async s => {
        if (s.proxy_pass.includes(':')) {
            let proxyPassSplit = s.proxy_pass.split(':')
            if (proxyPassSplit[0].match(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g)) {
                return true
            } else {
                if (parseMap.has(proxyPassSplit[0])) {
                    return parseMap.get(proxyPassSplit[0])
                } else {
                    resolveAny(proxyPassSplit[0])
                        .then(() => {
                            parseMap.set(proxyPassSplit[0], true)
                            return true
                        })
                        .catch(() => {
                            parseMap.set(proxyPassSplit[0], false)
                            return false
                        })
                }
            }
        } else {
            // handle upstream_name
        }
        return true
    })
}

const uniqueLocalPortCheck = ({ servers, upstreams }: RenderModel) => {
    let localPorts = new Set()
    servers = servers.filter(s => {
        if (localPorts.has(s.listen_port)) {
            return false
        } else {
            localPorts.add(s.listen_port)
            return true
        }
    })
    return { servers, upstreams }
}

const uniqueUpstreamNameCheck = ({ servers, upstreams }: RenderModel) => {
    let upstreamNames = new Set()
    upstreams = upstreams.filter(s => {
        if (upstreamNames.has(s.name)) {
            return false
        } else {
            upstreamNames.add(s.name)
            return true
        }
    })
    return { servers, upstreams }
}

export const checkChain = (render: RenderModel) => {
    return dnsCheck(uniqueLocalPortCheck(render))
}
