module.exports = {
  configureWebpack:{
    externals: {
      // vue: 'vue',
      'vue-router':'VueRouter',
      axios:'axios',
      // lodash:'_',
      echarts:'echarts',
      // nprogress : 'NProgress',
      // 'vue-quill-editor':'tree',
      "libraryName": "element-ui",
    }
  }
}
