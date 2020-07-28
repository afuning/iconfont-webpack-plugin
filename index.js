// IconfontPlugin.js 文件（独立模块）
const { download, getCssUrl, getFontUrl, getJsUrl } = require("./src/util");
const { fontTyps } = require("./src/config");
const formatCss = require("./src/format/css");
// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

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
    this.svgContent = "";
    this.fonts = []
  }
  // 执行器
  apply(compiler) {
    const publicPath = compiler.options.output.publicPath || "";
    const { type } = this.options;
    const taskAction = this.initAction()[type];
    // 执行前先下载iconfont资源
    compiler.hooks.run.tapAsync('IconfontPlugin', async (compiler, callback)=>{
      await taskAction.run();
      callback()
    })

    // 监听状态先下载iconfont资源
    compiler.hooks.watchRun.tapAsync('IconfontPlugin', async (compiler, callback)=>{
      await taskAction.run();
      callback()
    })

    // 监听htmlplugin
    compiler.hooks.compilation.tap('IconfontPlugin', (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.beforeAssetTagGeneration.tapAsync(
        'IconfontPlugin',
        (htmlPluginData, cb) => {
          // Manipulate the content
          taskAction.insertHtml(htmlPluginData, publicPath);
          // Tell webpack to move on
          cb(null, htmlPluginData)
        }
      )
      // 插入额外资源，css、字体文件
      compilation.hooks.additionalAssets.tapAsync('IconfontPlugin', (callback) => {
        taskAction.done(compilation)
        callback()
      })
    })

  }

  initAction() {
    const { dist, baseOption } = this.options;
    const me = this;
    /**
     * type：图标使用类型：fontclass，svg
     * run：进行资源下载
     * done：生成资源并赋值compilation
     * insertHtml：插入htmlPlugin生成的模版
     */
    return {
      fontclass: {
        async run() {
          await Promise.all([me.downloadFont(), me.downloadCss()]);
        },
        done(compilation) {
          compilation.assets[`${dist.dirPath}/${dist.filename}.css`] = {
            source: () => {
              return me.cssContent
            },
            size: () => {
              return me.cssContent.length
            }
          }
          me.fonts.forEach((data, index) => {
            compilation.assets[`${dist.dirPath}/${dist.filename}.${fontTyps[index]}`] = {
              source: () => {
                return data
              },
              size: () => {
                return data.length
              }
            }
          });
        },
        insertHtml(htmlPluginData, publicPath) {
          const link = me.createLink(publicPath, "css")
          htmlPluginData.assets.css.unshift(link)
        }
      },
      svg: {
        async run() {
          me.cssContent = `.${baseOption.fontFamily} {
            width: 24px;
            height: 24px;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
          }`;
          await Promise.all([me.downloadJS()]);
        },
        done(compilation) {
          compilation.assets[`${dist.dirPath}/${dist.filename}.css`] = {
            source: () => {
              return me.cssContent
            },
            size: () => {
              return me.cssContent.length
            }
          }
          compilation.assets[`${dist.dirPath}/${dist.filename}.js`] = {
            source: () => {
              return me.svgContent
            },
            size: () => {
              return me.svgContent.length
            }
          }
        },
        insertHtml(htmlPluginData, publicPath) {
          const jslink = me.createLink(publicPath, "js")
          htmlPluginData.assets.js.unshift(jslink)
          const csslink = me.createLink(publicPath, "css")
          htmlPluginData.assets.css.unshift(csslink)
        }
      }
    }
  }

  // 处理fontClass
  async downloadCss() {
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

  // 安装svgjs文件
  async downloadJS() {
    const { key } = this.options;
    this.svgContent = await download(getJsUrl(key))
  }

  // 为htmlplugin创建iconfont link
  createLink(publicPath, type) {
    const { dirPath, filename } = this.options.dist;
    return `${publicPath}${dirPath}/${filename}.${type}`;
  }
}
// 暴露插件
module.exports = IconfontPlugin;
