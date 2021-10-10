import { useEffect } from 'react'
import { debounce } from 'lodash'

const useWindowSizeChange = (fn: () => void) => {
    useEffect(() => {
        window.addEventListener('resize', debounce(fn))
        return window.removeEventListener('resize', debounce(fn))
    }, [])
}

export default useWindowSizeChange
