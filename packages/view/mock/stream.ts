import { Request, Response } from 'express'

export default {
    'GET /api/stream': (req: Request, res: Response) => {
        res.send({
            success: true,
            data: [
                {
                    id: 'qwe13sqdq',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 0,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                },
                {
                    id: 'wet123',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 1,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                },
                {
                    id: 'wet12345',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 1,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                },
                {
                    id: 'wet123453',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 1,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                },
                {
                    id: 'wet12363463453',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 1,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                },
                {
                    id: 'wet123454654653',
                    title: '这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题这只是一个标题',
                    // 中转 ip/域名
                    transitHost: 'google.com',
                    // 中转端口号
                    transitPort: 9527,
                    // 远程 ip/域名
                    remoteHost: 'github.com',
                    // 远程端口号
                    remotePort: 9527,
                    // 启用状态
                    state: 1,
                    // 负载均衡算法
                    loadBalancing: 1,
                    // 创建时间
                    createdTime: '2020-08-09',
                    // 更新时间
                    updatedTime: '2020-08-09',
                    // 备注
                    comment: '这只是一个备注'
                }
            ]
        })
    }
}
