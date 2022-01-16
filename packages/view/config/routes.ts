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
        path: '/upstream',
        name: 'upstream',
        icon: 'CloudServerOutlined',
        component: './Upstream'
    },
    {
        path: '/terminal',
        name: 'terminal',
        icon: 'CodeOutlined',
        component: './Shell'
    },
    {
        path: '/',
        redirect: '/module'
    },
    {
        component: './404'
    }
]
