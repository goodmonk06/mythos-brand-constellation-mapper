type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private context: LogContext = {}

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context }
  }

  private log(level: LogLevel, message: string, meta?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...this.context,
      ...meta,
    }

    if (process.env.NODE_ENV === 'development') {
      const colors = {
        debug: '\x1b[36m',
        info: '\x1b[32m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
      }
      const reset = '\x1b[0m'
      console.log(
        `${colors[level]}[${level.toUpperCase()}]${reset} ${message}`,
        meta ? meta : ''
      )
    } else {
      console.log(JSON.stringify(logData))
    }
  }

  debug(message: string, meta?: LogContext) {
    this.log('debug', message, meta)
  }

  info(message: string, meta?: LogContext) {
    this.log('info', message, meta)
  }

  warn(message: string, meta?: LogContext) {
    this.log('warn', message, meta)
  }

  error(message: string, error?: Error | unknown, meta?: LogContext) {
    this.log('error', message, {
      ...meta,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    })
  }

  child(context: LogContext): Logger {
    const childLogger = new Logger()
    childLogger.setContext({ ...this.context, ...context })
    return childLogger
  }
}

export const logger = new Logger()
export default logger
