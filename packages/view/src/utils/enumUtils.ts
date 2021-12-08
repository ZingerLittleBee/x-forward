import { LoadBalancingEnum } from '@/enums/StreamEnum'

// 将 loadBalancingEnum 组装成 [{ value: xxx, label: xxx }]
export const loadBalancingSelectProp = () => {
    return Object.keys(LoadBalancingEnum)
        .filter((_, i) => LoadBalancingEnum[i] !== undefined)
        .map(l => {
            return {
                label: LoadBalancingEnum[l],
                value: l
            }
        })
}

export const getEnumKeyByValue = (value: any) => {
    return Object.keys(LoadBalancingEnum)
        .filter(key => {
            return LoadBalancingEnum[key] !== undefined
        })
        .find(l => LoadBalancingEnum[l] === value)
}

export const turnState2Boolean = (state: number | undefined) => {
    return state === 0
}
