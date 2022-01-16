import { Settings as LayoutSettings } from '@ant-design/pro-layout'

const Settings: LayoutSettings & {
    pwa?: boolean
    logo?: string
} = {
    navTheme: 'light',
    // 拂晓蓝
    primaryColor: '#722ED1',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
    title: 'x-forward',
    pwa: false,
    logo: 'logo.svg',
    iconfontUrl: '',
    splitMenus: false
}

export default Settings
