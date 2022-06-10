export const okOrEmpty = (flag: boolean, truely: unknown, falsely = '') => {
    return flag ? truely : falsely
}

// export const getTextFromVNode = (node: VNode) => {
//     const total = []
//     const search = (node: VNode) => {
//         const children = node?.children
//         if (isString(children)) {
//             return children
//         }
//         if (isNil(children) && !isVNode(children)) {
//             return ''
//         }
//         if (Array.isArray(children)) {
//             return (children as VNodeArrayChildren).map(child => search(child as unknown as VNode))
//         }
//         return search(node.children as unknown as VNode)
//     }
//     total.push(search(node))
//     return total.length === 1 ? total[0] : total
// }
