function formatCss (content, baseOption) {
  // const { fontFamily, fontSize, classPre } = baseOption;
  // const data= createF(content, baseOption)
  const ins = new CssModule(content, baseOption)
  // 修改font-family
  ins.changeFamily()
    .changeFontSize()
    .changeFonturl()
    .changeMainClass()
  return ins.content
}

class CssModule {
  constructor(content, option) {
    this.content = content
    this.option = option
    this.mainClass = this.getMainClass()
  }

  getMainClass() {
    const reg = /font-family: "(.*)"/
    return reg.exec(this.content)[1]
  }

  // 修改font-family
  changeFamily() {
    const { fontFamily } = this.option
    const reg = /font-family: ".*"/g
    this.content = this.content.replace(reg, `font-family: "${fontFamily}"`)
    return this
  }

  // 修改font-size
  changeFontSize() {
    const { fontSize } = this.option
    const reg = /font-size: .*px/g
    this.content =this.content.replace(reg, `font-size: ${fontSize}`)
    return this
  }

  changeMainClass() {
    const oldMainClass = this.mainClass
    const { mainClass } = this.option
    const reg = new RegExp(`\\.${oldMainClass}`)
    console.log(oldMainClass, mainClass, reg)
    this.content = this.content.replace(reg, `.${mainClass}`)
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