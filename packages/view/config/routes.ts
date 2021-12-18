export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                name: 'login',
                path: '/user/login',
                component: './user/Login'
            },
            {
                component: './404'
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'DashboardOutlined',
        component: './Dashboard'
    },
    {
        path: '/module',
        name: 'module',
        icon: 'AppstoreAddOutlined',
        component: './Module'
    },
    {
        path: '/stream',
        name: 'stream',
        icon: 'CloudSyncOutlined',
        component: './Stream'
    },
    {
        path: '/terminal',
        name: 'terminal',
        icon: 'CodeOutlined',
        component: './Shell'
    },
    {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        access: 'canAdmin',
        component: './Admin',
        routes: [
            {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome'
            },
            {
                component: './404'
            }
        ]
    },
    {
        name: 'list.table-list',
        icon: 'table',
        path: '/list',
        component: './TableList'
    },
    {
        path: '/',
        redirect: '/module'
    },
    {
        component: './404'
    }
]
