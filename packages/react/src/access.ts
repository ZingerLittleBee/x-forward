/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.UserVo | undefined }) {
    const { currentUser } = initialState || {}
    return {
        canAdmin: currentUser && currentUser.username === 'admin'
    }
}
