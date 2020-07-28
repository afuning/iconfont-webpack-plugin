const request = require("request")
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const { origin, fontTyps } = require("./config")
const { logWithSpinner, stopSpinner } = require("./spanner")
// 获取资源
function download(url) {
  logWithSpinner(`${chalk.green('✔')}`, `dowload：${url}`)
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      stopSpinner(true)
      resolve(body)
    })
  })
}
// 获取资源到新文件中
function rwFile(url, dist) {
  request.get(url).pipe(fs.createWriteStream(dist));
}
// 生成文件
function insertFile(staticPath, filename, content) {
  if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(staticPath)
  } else {
    // 删除文件夹中同后缀文件
    const extname = path.extname(filename);
    delFile(staticPath, `.*\.${extname}`);
  }
  fs.writeFileSync(getPath(staticPath, filename), content)
}
// 删除文件
function delFile(dir, pattern = "") {
  const files = fs.readdirSync(dir);
  let reg = new RegExp(pattern)
  files.forEach((filename, index) => {
    if (reg.test(filename)) {
      fs.unlinkSync(getPath(dir, filename))
    }
  })
}
// 获取font资源地址
function getFontUrl(key) {
  return fontTyps.map((type) => {
    return `${origin}${key}.${type}`
  })
}
// 获取css资源地址
function getCssUrl(key) {
  return `${origin}${key}.css`
}
// 获取js资源地址
function getJsUrl(key) {
  return `${origin}${key}.js`
}
// 获取生成地址
function getPath(root, dir) {
  return path.join(root, dir);
}

module.exports = {
  download,
  getCssUrl,
  getFontUrl,
  getJsUrl,
  // 生成文件
  insertFile,
  getPath
}