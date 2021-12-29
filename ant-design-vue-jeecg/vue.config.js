const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生產環境的 source map，可以將其設置為 false 以加速生產環境構建。
  productionSourceMap: false,
  // 多入口配置
  // pages: {
  //   index: {
  //     entry: 'src/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html',
  //   }
  // },
  //打包app時放開該配置
  //publicPath:'./',
  configureWebpack: config => {
    //生產環境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))

    //生產環境，開啟js\css壓縮
    if (process.env.NODE_ENV === 'production') {
        config.plugin('compressionPlugin').use(new CompressionPlugin({
          test: /\.(js|css|less)$/, // 匹配文件名
          threshold: 10240, // 對超過10k的數據壓縮
          deleteOriginalAssets: false // 不刪除源文件
        }))
    }

    // 配置 webpack 識別 markdown 為普通的文件
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
      .end()

    // 編譯vxe-table包里的es6代碼，解決IE11兼容問題
    config.module
      .rule('vxe')
      .test(/\.js$/)
      .include
        .add(resolve('node_modules/vxe-table'))
        .add(resolve('node_modules/vxe-table-plugin-antd'))
        .end()
      .use()
      .loader('babel-loader')
      .end()

  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 變量覆蓋，用於自定義 ant design 主題 */
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {
     /* '/api': {
        target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro', //mock API接口系統
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/jeecg-boot': ''  //默認所有請求都加了jeecg-boot前綴，需要去掉
        }
      },*/
      '/jeecg-boot': {
        target: 'http://localhost:8080', //請求本地 需要jeecg-boot後台項目
        ws: false,
        changeOrigin: true
      },
    }
  },

  lintOnSave: undefined
}