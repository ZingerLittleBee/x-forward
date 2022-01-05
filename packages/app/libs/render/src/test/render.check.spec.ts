import { dnsCheck } from '../render.check'
import { RenderModel } from '../render.interface'

describe('RenderCheck', () => {
    const renderModel: RenderModel = {
        servers: [
            // normal
            {
                listen_port: 1111,
                proxy_pass: 'baidu.com:4653'
            },
            // error domain
            {
                listen_port: 1112,
                proxy_pass: 'xxxzq.qrqw:4653'
            },
            // normal
            {
                listen_port: 1113,
                proxy_pass: 'test7'
            },
            // error upstreamName
            {
                listen_port: 1114,
                proxy_pass: 'test8'
            }
        ],
        upstreams: [{ name: 'test7', server: [{ upstream_host: 'baidu.com', upstream_port: 123 }] }]
    }
    describe('dnsCheck', () => {
        it('dnsCheck error', () => {
            console.log('dnsCheck', dnsCheck(renderModel))
        })
    })
})
