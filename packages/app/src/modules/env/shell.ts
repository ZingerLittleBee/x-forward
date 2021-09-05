import { $ } from 'zx'

export const installNginx = async (version: string) => {
    const res = $`wget http://nginx.org/download/nginx-${version}.tar.gz`
    // let res = $`sleep 1; echo 1; sleep 2; echo 2`
    let chunk = ''
    res.stderr.on('data', msg => {
        chunk ? chunk + '\n' : null
        chunk += msg
    })
    res.stderr.on('end', () => console.log(chunk))
}
