import { defineComponent, reactive } from 'vue'
import { getRouterInfo } from '../../../hooks/router.hook'

const SideBar = defineComponent({
    setup() {
        const routeInfo = getRouterInfo()
        const status = reactive(new Array(routeInfo.length).fill(false))
        const handleClick = (i: number) => {
            status.forEach((s, index) => {
                i === index ? (status[i] = !status[i]) : (status[index] = false)
            })
        }
        return () => (
            <ul class="menu bg-base-100 w-56 p-2 h-full">
                {routeInfo.map((r, i) => (
                    <li onClick={() => handleClick(i)}>
                        <router-link to={routeInfo[i].path} class={status[i] ? 'active' : ''}>
                            {routeInfo[i].icon}
                            {r.name}
                        </router-link>
                    </li>
                ))}
            </ul>
        )
    }
})

export default SideBar
