import { Request, Response } from 'express'

export default {
    'GET /env/dir/:dir': (req: Request, res: Response) => {
        console.log('params', req.query)
        res.send({
            success: true,
            data: ['file1', 'file2', 'file3', 'file4']
        })
    },

    'GET /env/nginx': (req: Request, res: Response) => {
        res.send({
            success: true,
            data: {
                os: 'Debian GNU/Linux 10',
                nginxPath: '/usr/local/nginx',
                nginxUptime: '20d:10h:20m:10s',
                nginxStatus: 0
            }
        })
    },

    'GET /env/path/:path': (req: Request, res: Response) => {
        const { path } = req.params
        console.log('path', path)
        if (path === 'nginx') {
            res.send({
                success: true,
                data: [
                    { label: '执行目录', value: '/usr/local/nginx' },
                    { label: '配置目录', value: '/etc/nginx/conf.d' },
                    { label: '日志目录', value: '/var/local/nginx' }
                ]
            })
        }
    }

    // 'GET /env/nginx/:version': (req: Request, res: Response) => {
    //   console.log('req', req.method, req.params, req.body, req.query);
    //   res.send({
    //     success: true,
    //   });
    // },
    //
    // 'POST /env/nginx': (req: Request, res: Response) => {
    //   console.log('req', req.method, req.params, req.body);
    //   res.send({
    //     success: true,
    //   });
    // },
}
