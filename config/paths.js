'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('docs'),
  appEntry: resolveApp('src/main.ts'),
  appSrc: resolveApp('src'),
  appHtml: resolveApp('index.html'),
  appStatic: resolveApp('static'),
  appAssets: resolveApp('src/assets')
}


