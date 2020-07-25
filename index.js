// IconfontPlugin.js 文件（独立模块）
const { download, insertFile, getCssUrl, getPath, getFontUrl } = require("./src/util");
const { fontTyps } = require("./src/config");
const formatCss = require("./src/format/css");
// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');
const path = require("path");

class IconfontPlugin{ 
  //在构造函数中获取用户为该插件传入的配置
  constructor(pluginOptions = {}) {
    this.options = Object.assign({
      type: 'fontclass',
      key: '',
      baseOption: {
        fontFamily: 'afuning',
        fontSize: '20px'
      },
      dist: {
        dirPath: "icon",
        filename: "afuning"
      }
    }, pluginOptions);
    this.cacheKey = this.options.key;
    this.cssContent = "";
    this.fonts = []
  }
  apply(compiler) {
    const outputPath = compiler.options.output.path;
    const publicPath = compiler.options.output.publicPath || "";
    const { dist } = this.options

    // 执行前先下载iconfont资源
    compiler.hooks.beforeRun.tapAsync('IconfontPlugin', async (compiler, callback)=>{
      await this.applyTask();
      callback()
    })

    // 生成资源，插入目标文件夹
    compiler.hooks.done.tap('IconfontPlugin', stats => {
      // 生成css文件
      let cssDistPath = getPath(outputPath, dist.dirPath);
      insertFile(cssDistPath, `${dist.filename}.css`, this.cssContent);
      // 生成字体文件
      let fontDistPath = getPath(outputPath, dist.dirPath);
      this.fonts.forEach((data, index) => {
        insertFile(fontDistPath, `${dist.filename}.${fontTyps[index]}`, data);
      })
    })

    // 监听
    compiler.hooks.compilation.tap('IconfontPlugin', (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTags.tapAsync(
        'IconfontPlugin',
        (htmlPluginData, cb) => {
          // Manipulate the content
          const linkTag = this.createLink(publicPath)
          htmlPluginData.assetTags.styles.unshift(linkTag)
          // Tell webpack to move on
          cb(null, htmlPluginData)
        }
      )
    })
  }
  // 分发任务
  async applyTask() {
    const { type } = this.options;
    switch (type) {
      case 'fontclass':
        await Promise.all([this.downloadFont(), this.factoryFontclass()]);
        break;
      default:
        break;
    }
  }

  // 处理fontClass
  async factoryFontclass() {
    const { key } = this.options;
    let cssContent = await download(getCssUrl(key));
    // 根据配置格式化
    this.cssContent = formatCss(cssContent, {...this.options.baseOption, key, ...this.options.dist});
  }

  // 安装字体文件
  async downloadFont() {
    const { key } = this.options;
    let p = []
    p = getFontUrl(key).map(url => {
      return download(url)
    })
    this.fonts = await Promise.all(p)
  }

  // 为htmlplugin创建iconfont link
  createLink(publicPath) {
    const { dirPath, filename } = this.options.dist;
    console.log(publicPath, dirPath);
    return {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        type: "text/css",
        href: path.join(publicPath, dirPath, `${filename}.css`)
      }
    }
  }
}
// 暴露插件
module.exports = IconfontPlugin;
