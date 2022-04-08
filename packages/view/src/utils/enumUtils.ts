import { LoadBalancingEnum } from '@forwardx/shared'

// 将 loadBalancingEnum 组装成 [{ value: xxx, label: xxx }]
export const loadBalancingSelectProp = () => {
    return Object.keys(LoadBalancingEnum)
        .filter((_, i) => LoadBalancingEnum[i] !== undefined)
        .map(l => {
            return {
                label: LoadBalancingEnum[l],
                value: Number(l)
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

export const turnState2Boolean = (state: number | undefined, defaultState?: boolean) => {
    if (defaultState) {
        return state ? state === 0 : defaultState
    }
    return state === 0
}
