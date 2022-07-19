import { isNil, isObject, isString } from 'lodash'
import { isVNode, VNode, VNodeNormalizedChildren } from 'vue'

export const okOrEmpty = (flag: boolean, truely: unknown, falsely = '') => {
    return flag ? truely : falsely
}

export type SimpleVNode = Record<string | number, Record<string | number, unknown>>

/**
 * Recursion get { key: Text } in VNode
 * and Text on same level, will combine to array
 * and if return value like [[1, 3]], will be flated to [1, 3]
 *
 * examples
 * ```JS
 * VNode
 * {
 *      name: (
 *          <div class="flex items-center space-x-3">
 *              <div>
 *                  <div class="font-bold">Hart Hagerty</div>
 *                  <div class="text-sm opacity-50">United States</div>
 *              </div>
 *          </div>
 *      ),
 *      job: (
 *          <>
 *              Zemlak, Daniel and Leannon
 *              <br />
 *              <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
 *          </>
 *      ),
 *      color: h('div', 'Purple'),
 *      subRow: {
 *          name: 'John Brown2',
 *          job: 'Zemlak, Daniel and Leannon2',
 *          color: 'Purple2'
 *      }
 *  },
 * ```
 *
 * and then return
 * ```JS
 * [
 *   {
 *       "name": [
 *           "Hart Hagerty",
 *           "United States"
 *       ]
 *   },
 *   {
 *       "job": [
 *           "Zemlak, Daniel and Leannon",
 *           "Desktop Support Technician"
 *       ]
 *   },
 *   {
 *       "color": "Purple"
 *   },
 *   {
 *       "subRow": {
 *           "name": "John Brown2",
 *           "job": "Zemlak, Daniel and Leannon2",
 *           "color": "Purple2"
 *       }
 *   }
 *   ]
 * ```
 *
 * @param node { name: VNode, age: VNode }
 * @returns Array consisting of Text
 */
export const getTextFromVNode = (node: SimpleVNode): any => {
    const handleVNode = (node: SimpleVNode): unknown => {
        const children = node?.children
        if (isNil(children)) {
            return isObject(node) && !isVNode(node) ? node : ''
        }
        if (isString(children)) return children
        if (Array.isArray(children)) {
            return children.map(c => handleVNode(c)).filter(c => !!c)
        }

        return handleVNode(children as Record<string | number, Record<string | number, unknown>>)
    }

    return Object.keys(node).map(key => {
        const res = handleVNode(node[key] as SimpleVNode)
        return {
            [key]: Array.isArray(res) ? res.flat(5) : res
        }
    })
}

/**
 * Recursion add param to click event of VNode
 *
 * example
 * ```JS
 * <div onClick={e => console.log('div click', e)}>
 *       <span onClick={e => console.log('span click', e)}>
 *           <button class="btn" onClick={e => console.log('btn click', e)}>
 *               Click
 *           </button>
 *       </span>
 * </div>
 * ```
 * e === param
 *
 * @param node VNode
 * @param param Record<string | number, unknown>
 * @returns VNode which has called with param on click event
 */
export const appendParamOnClick = (node: VNode, param: Record<string | number, unknown>) => {
    if (node.props?.onClick) {
        const click = node.props?.onClick
        node.props.onClick = () => click(param)
    }
    if (node.children) {
        if (isVNode(node.children)) {
            node.children = appendParamOnClick(node.children, param) as unknown as VNodeNormalizedChildren
        }
        if (Array.isArray(node.children)) {
            node.children = (node.children as unknown as VNode[]).map(c =>
                appendParamOnClick(c, param)
            ) as unknown as VNodeNormalizedChildren
        }
    }
    return node
}

export const combineClasses = (classes: string | string[] | undefined) => {
    return classes ? (Array.isArray(classes) ? classes.join(' ') : classes) : ''
}

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const textOverflowCheck = (div: HTMLElement) => {
    return div.scrollWidth > div.offsetWidth
}
