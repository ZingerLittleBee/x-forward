import { defineComponent, ref, Transition } from 'vue'
import LessIcon from '~icons/ci/unfold-less'
import MoreIcon from '~icons/ci/unfold-more'
import './index.css'

const Selector = defineComponent({
    setup() {
        const focusStatus = ref(false)
        const handleFocus = () => (focusStatus.value = true)
        const handleFocusout = () => (focusStatus.value = false)
        return () => (
            <div class="dropdown dropdown-end">
                <div tabindex="0" class="rounded-full">
                    <label class="relative block">
                        <label
                            class="absolute inset-y-0 right-0 items-center pr-2 cursor-pointer"
                            onClick={() => (focusStatus.value = !focusStatus.value)}
                        >
                            <Transition name="selector-fade">
                                {focusStatus.value ? (
                                    <MoreIcon class="fill-current w-6 h-full text-base-300" />
                                ) : (
                                    <LessIcon class="fill-current w-6 h-full text-base-300" />
                                )}
                            </Transition>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            class="w-72 pr-12 input input-bordered input-accent max-w-lg"
                            onFocus={handleFocus}
                            onFocusout={handleFocusout}
                        />
                    </label>
                </div>
                {focusStatus.value && (
                    <ul
                        tabindex="0"
                        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-72"
                    >
                        <li>
                            <a class="justify-between">
                                Profile
                                <span class="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                )}
            </div>
        )
    }
})
export default Selector
