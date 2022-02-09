/* eslint-disable global-require */
// eslint-disable-next-line
const { execSync } = require('child_process')
// eslint-disable-next-line
const { join } = require('path')
// eslint-disable-next-line
const findChrome = require('carlo/lib/find_chrome')
// eslint-disable-next-line
const detectInstaller = require('detect-installer')

const installPuppeteer = () => {
    // find can use package manager
    const packages = detectInstaller(join(__dirname, '../'))
    // get installed package manager
    const packageName = packages.find(detectInstaller.hasPackageCommand) || 'npm'
    console.log(`🤖 will use ${packageName} install puppeteer`)
    const command = `${packageName} ${packageName.includes('yarn') ? 'add' : 'i'} puppeteer`
    execSync(command, {
        stdio: 'inherit'
    })
}

const initPuppeteer = async () => {
    try {
        // eslint-disable-next-line
        const findChromePath = await findChrome({})
        const { executablePath } = findChromePath
        console.log(`🧲 find you browser in ${executablePath}`)
        return
    } catch (error) {
        console.log('🧲 no find chrome')
    }

    try {
        require.resolve('puppeteer')
    } catch (error) {
        // need install puppeteer
        await installPuppeteer()
    }
}

initPuppeteer()
