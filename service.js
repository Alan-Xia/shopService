'use strict'

import express from './config/myproject'
import config from './config/config'
import logger from './app/utils/logger'

let app = express()

app.listenAsync(config.port).then(() => {
  logger.info(`启动成功,端口号${config.port}`)
})