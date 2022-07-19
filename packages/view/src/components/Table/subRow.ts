import { isObject } from 'lodash'
import { h, isVNode, VNode } from 'vue'

export const handleSubRow = (subRow?: string | number | VNode | VNode[] | (string | number)[]) => {
    if (subRow) {
        if (Array.isArray(subRow)) {
            // handle array
            return subRow.map(s => {
                if (isVNode(s)) return h(s)
                if (isObject(s))
                    return h(
                        'p',
                        Object.keys(s).map(key => h('span', key + ': ' + s[key] + ' '))
                    )
                return h('div', s)
            })
        } else {
            if (isVNode(subRow)) return h(subRow)
            return h('div', subRow)
        }
    }
    return ''
}
