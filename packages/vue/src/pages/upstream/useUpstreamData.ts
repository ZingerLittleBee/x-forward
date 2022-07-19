import { ServerVo } from '@x-forward/app/apps/x-forward-server/src/modules/server/vo/server.vo'
import { UpstreamVo } from '@x-forward/app/apps/x-forward-server/src/modules/upstream/vo/upstream.vo'
import { Ref, ref, watchEffect } from 'vue'

type UpstreamType = Pick<UpstreamVo, 'name' | 'loadBalancing' | 'state' | 'createTime' | 'server'> & {
    serverLength: number | string
}

type ServerType = Pick<
    ServerVo,
    'upstreamHost' | 'upstreamPort' | 'weight' | 'maxCons' | 'maxFails' | 'failTimeout' | 'backup' | 'down'
>

export const UpstreamColumns: (keyof UpstreamType)[] = [
    'name',
    'state',
    'loadBalancing',
    'serverLength',
    'createTime',
    'server'
]

export const UpstreamShowColumns = UpstreamColumns.filter(uc => uc !== 'server')

export const ServerColumns: (keyof ServerType)[] = [
    'upstreamHost',
    'upstreamPort',
    'weight',
    'maxCons',
    'maxFails',
    'failTimeout',
    'backup',
    'down'
]

const serverHanler = (servers: ServerVo[]): ServerType[] => {
    return servers?.map(s => {
        const temp: any = {}
        ServerColumns.forEach(sc => {
            temp[sc] = s[sc]
        })
        return temp
    })
}

// computed upstreams by UpstreamColumns
const useUpstreamData = (rawUpstreams: Ref<UpstreamVo[] | undefined>) => {
    const showUpstreams = ref<UpstreamType[]>([])
    watchEffect(() => {
        if (rawUpstreams.value) {
            showUpstreams.value = rawUpstreams.value?.map(u => {
                const temp: any = {}
                UpstreamColumns.forEach(uc => {
                    if (uc === 'serverLength') {
                        temp['serverLength'] = u.server?.length ? u.server?.length : 0
                    } else if (uc === 'server') {
                        temp[uc] = serverHanler(u[uc] as ServerVo[])
                    } else {
                        temp[uc] = u[uc]
                    }
                })
                return temp
            })
        }
    })
    return showUpstreams
}

export default useUpstreamData
