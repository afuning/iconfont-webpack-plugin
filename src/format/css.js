function formatCss (content, baseOption) {
  // const { fontFamily, fontSize, classPre } = baseOption;
  // const data= createF(content, baseOption)
  const ins = new CssModule(content, baseOption)
  // 修改font-family
  ins.changeFamily()
    .changeMainName()
    .changeFonturl()
  return ins.content
}

class CssModule {
  constructor(content, option) {
    this.content = content
    this.option = option
  }

  // 修改font-family
  changeFamily() {
    const { fontFamily } = this.option
    const reg = /font-family: ".*"/g
    this.content =this.content.replace(reg, `font-family: "${fontFamily}"`)
    return this
  }

  // 修改font-size
  changeMainName() {
    const { fontSize } = this.option
    const reg = /font-size: .*px/g
    this.content =this.content.replace(reg, `font-size: ${fontSize}`)
    return this
  }

  // 修改font资源引用
  changeFonturl() {
    const { key, filename } = this.option;
    const reg = new RegExp(`//at.alicdn.com/t/${key}`, 'g');
    this.content =this.content.replace(reg, `./${filename}`)
    return this
  }
}

module.exports = formatCss