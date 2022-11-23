const log4js = require('log4js');

log4js.configure({
    appenders: {
      loggerConsole: { type: 'console' },
      loggerFile: { type: 'file', filename: 'info.log' },
      warnFile: { type: 'file', filename: 'warn.log' },
      errorFile: { type: 'file', filename: 'error.log' },
    },
    categories: {
      default: { appenders: ['loggerConsole','loggerFile'], level: 'info' },
      warn: { appenders: ['loggerConsole','warnFile'], level: 'warn' },
      error: { appenders: ['loggerConsole','errorFile'], level: 'error' },
    },
  });

const logger = log4js.getLogger('default');
const loggerErr = log4js.getLogger('error');
const loggerWarn = log4js.getLogger('warn');

module.exports = {logger, loggerErr, loggerWarn}