type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'
  private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'info'

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (context && Object.keys(context).length > 0) {
      log += ` | Context: ${JSON.stringify(context)}`
    }
    
    if (error) {
      log += ` | Error: ${error.message}`
      if (error.stack && this.isDevelopment) {
        log += `\nStack: ${error.stack}`
      }
    }
    
    return log
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    const formattedLog = this.formatLog(entry)

    // In production, you might want to send these to a logging service
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
        case 'info':
          console.log(formattedLog)
          break
        case 'warn':
          console.warn(formattedLog)
          break
        case 'error':
          console.error(formattedLog)
          break
      }
    } else {
      // In production, send to logging service
      // For now, just console.log with structured data
      console.log(JSON.stringify(entry))
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    this.log('error', message, context, errorObj)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for use in error boundaries
export const logError = (error: Error | unknown, context?: Record<string, any>) => {
  if (error instanceof Error) {
    logger.error(error.message, error, context)
  } else {
    logger.error('Unknown error occurred', new Error(String(error)), context)
  }
}