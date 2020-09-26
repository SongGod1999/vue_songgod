module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    // devServer: {
    //     open: true,
    //     host: 'localhost',
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8081',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/api/': ''
    //             }
    //         }
    //     }
    // },
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            // config.set('externals', {
            //     Vue: 'vue',
            //     'vue-router': 'VueRouter',
            //     axios: 'axios',
            //     lodash: '_',
            //     echarts: 'echarts',
            //     nprogress: 'NProgress',
            //     'vue-quill-editor': 'VueQuillEditor'
            //  })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-prod.js')
        })
    }
}
