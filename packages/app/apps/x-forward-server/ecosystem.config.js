module.exports = {
    apps: [
        {
            name: 'x-forward-server',
            script: './main.js',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
}
