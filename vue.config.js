module.exports = {
  baseUrl: './',
  outputDir: 'dist',
  lintOnSave: true,
  chainWebpack: (config) => {
    config.module.rule('scss$')
      .test(/\.scss$/)
      .use('sass-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: ['./src/assets/css/constant.scss']
      })
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.uglifyOptions.compress['drop_console'] = true
    } else {
    }
  },
  productionSourceMap: false,
  css: {
    extract: process.env.NODE_ENV == 'production',
    // extract: false,
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    modules: false
  },
  parallel: require('os').cpus().length > 1,
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8083,
    https: false,
    hotOnly: false,
    proxy: null,
    before: app => {
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  // 第三方插件配置
  pluginOptions: {}
}
