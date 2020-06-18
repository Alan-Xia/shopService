'use strict'

import winston from 'winston'

const loggeer = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: './logs/applog.log'})
  ]
})

export default loggeer