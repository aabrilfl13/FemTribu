// src/utils/logger.ts
type LogLevel = "info" | "warn" | "error" | "debug"

interface LogContext {
	[key: string]: any
}

class Logger {
	private log(level: LogLevel, message: string, context?: LogContext) {
		// Vercel prefers structured JSON logs
		const logData = {
			level,
			message,
			...(context && { context }),
			// Only add timestamp in dev (Vercel adds it automatically in prod)
			...(import.meta.env.DEV && { timestamp: new Date().toISOString() }),
		}

		// Use appropriate console method
		switch (level) {
			case "error":
				console.error(JSON.stringify(logData))
				break
			case "warn":
				console.warn(JSON.stringify(logData))
				break
			case "debug":
				console.debug(JSON.stringify(logData))
				break
			default:
				console.log(JSON.stringify(logData))
		}
	}

	info(message: string, context?: LogContext) {
		this.log("info", message, context)
	}

	warn(message: string, context?: LogContext) {
		this.log("warn", message, context)
	}

	error(message: string, error?: Error, context?: LogContext) {
		const errorContext = error
			? {
					...context,
					error: {
						message: error.message,
						stack: error.stack,
						name: error.name,
					},
				}
			: context
		this.log("error", message, errorContext)
	}

	debug(message: string, context?: LogContext) {
		// Only log debug in development
		if (import.meta.env.DEV) {
			this.log("debug", message, context)
		}
	}
}

export const logger = new Logger()
