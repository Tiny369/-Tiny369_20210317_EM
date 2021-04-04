module.exports = {
  presets: [
    '@vue/app'
  ],
  // 配置 按需引入elment-ui
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
