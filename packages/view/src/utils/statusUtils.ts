export const state2Boolean = (state: number | undefined) => {
    return !state
}

export const state2Number = (state: boolean) => {
    return Number(!state)
}
