/**
 * Logger - Gateway-style logging system for HMI application
 * Similar to Ignition's wrapper.log functionality
 */
class Logger {
    constructor(name = 'HMI', config = {}) {
        this.name = name;
        this.config = {
            maxLogSize: 1000,
            logLevel: 'INFO', // ERROR, WARN, INFO, DEBUG, TRACE
            showTimestamp: true,
            showSource: true,
            persistLogs: true,
            consoleOutput: true,
            ...config
        };

        this.logs = [];
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3,
            TRACE: 4
        };

        // Initialize storage
        this.loadPersistedLogs();

        // Add global error handler
        this.setupGlobalErrorHandler();
    }

    setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            this.error('Uncaught error', {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled promise rejection', {
                reason: event.reason
            });
        });
    }

    log(level, message, data = null, source = null) {
        // Check log level
        if (this.logLevels[level] > this.logLevels[this.config.logLevel]) {
            return;
        }

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            source: source || this.getCallSource()
        };

        // Add to log buffer
        this.logs.push(logEntry);

        // Maintain max log size
        if (this.logs.length > this.config.maxLogSize) {
            this.logs.shift();
        }

        // Format log message
        const formattedMessage = this.formatLogMessage(logEntry);

        // Output to console if enabled
        if (this.config.consoleOutput) {
            this.outputToConsole(level, formattedMessage, data);
        }

        // Persist logs if enabled
        if (this.config.persistLogs) {
            this.persistLogs();
        }

        // Emit log event for any listeners
        if (window.eventBus) {
            window.eventBus.emit('log:entry', logEntry);
        }

        return logEntry;
    }

    formatLogMessage(entry) {
        let message = '';

        if (this.config.showTimestamp) {
            const time = new Date(entry.timestamp).toLocaleTimeString();
            message += `[${time}] `;
        }

        message += `[${entry.level}] `;

        if (this.config.showSource && entry.source) {
            message += `[${entry.source}] `;
        }

        message += entry.message;

        return message;
    }

    outputToConsole(level, message, data) {
        const style = this.getLogStyle(level);

        switch (level) {
            case 'ERROR':
                console.error(`%c${message}`, style, data);
                break;
            case 'WARN':
                console.warn(`%c${message}`, style, data);
                break;
            case 'DEBUG':
                console.debug(`%c${message}`, style, data);
                break;
            case 'TRACE':
                console.trace(`%c${message}`, style, data);
                break;
            default:
                console.log(`%c${message}`, style, data);
        }
    }

    getLogStyle(level) {
        const styles = {
            ERROR: 'color: #ff5252; font-weight: bold;',
            WARN: 'color: #ffb74d; font-weight: bold;',
            INFO: 'color: #81c784;',
            DEBUG: 'color: #64b5f6;',
            TRACE: 'color: #9575cd;'
        };
        return styles[level] || '';
    }

    getCallSource() {
        try {
            const stack = new Error().stack;
            const lines = stack.split('\n');
            // Find the first line that's not from Logger.js
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i];
                if (!line.includes('Logger.js')) {
                    const match = line.match(/at\s+(\S+)/);
                    if (match) {
                        return match[1];
                    }
                }
            }
        } catch (e) {
            // Fallback if stack trace fails
        }
        return this.name;
    }

    // Convenience methods
    error(message, data = null) {
        return this.log('ERROR', message, data);
    }

    warn(message, data = null) {
        return this.log('WARN', message, data);
    }

    info(message, data = null) {
        return this.log('INFO', message, data);
    }

    debug(message, data = null) {
        return this.log('DEBUG', message, data);
    }

    trace(message, data = null) {
        return this.log('TRACE', message, data);
    }

    // Log management methods
    clear() {
        this.logs = [];
        if (this.config.persistLogs) {
            localStorage.removeItem('hmi_logs');
        }
    }

    getLogs(filter = {}) {
        let filteredLogs = [...this.logs];

        if (filter.level) {
            filteredLogs = filteredLogs.filter(log => log.level === filter.level);
        }

        if (filter.startTime) {
            filteredLogs = filteredLogs.filter(log =>
                new Date(log.timestamp) >= new Date(filter.startTime)
            );
        }

        if (filter.endTime) {
            filteredLogs = filteredLogs.filter(log =>
                new Date(log.timestamp) <= new Date(filter.endTime)
            );
        }

        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filteredLogs = filteredLogs.filter(log =>
                log.message.toLowerCase().includes(searchLower)
            );
        }

        return filteredLogs;
    }

    exportLogs(format = 'json') {
        const logs = this.getLogs();

        switch (format) {
            case 'json':
                return JSON.stringify(logs, null, 2);

            case 'csv':
                const headers = 'Timestamp,Level,Source,Message,Data\n';
                const rows = logs.map(log => {
                    const data = log.data ? JSON.stringify(log.data) : '';
                    return `"${log.timestamp}","${log.level}","${log.source}","${log.message}","${data}"`;
                }).join('\n');
                return headers + rows;

            case 'text':
                return logs.map(log => this.formatLogMessage(log)).join('\n');

            default:
                return logs;
        }
    }

    downloadLogs(filename = 'hmi_logs.txt', format = 'text') {
        const content = this.exportLogs(format);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    persistLogs() {
        try {
            // Only persist last 100 logs to avoid storage issues
            const logsToStore = this.logs.slice(-100);
            localStorage.setItem('hmi_logs', JSON.stringify(logsToStore));
        } catch (e) {
            console.error('Failed to persist logs:', e);
        }
    }

    loadPersistedLogs() {
        try {
            const stored = localStorage.getItem('hmi_logs');
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load persisted logs:', e);
        }
    }

    setLogLevel(level) {
        if (this.logLevels.hasOwnProperty(level)) {
            this.config.logLevel = level;
            this.info(`Log level changed to ${level}`);
        }
    }

    getStats() {
        const stats = {
            total: this.logs.length,
            byLevel: {},
            oldestLog: null,
            newestLog: null
        };

        Object.keys(this.logLevels).forEach(level => {
            stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
        });

        if (this.logs.length > 0) {
            stats.oldestLog = this.logs[0];
            stats.newestLog = this.logs[this.logs.length - 1];
        }

        return stats;
    }

    // Performance timing helpers
    startTimer(label) {
        const key = `timer_${label}`;
        performance.mark(key + '_start');
        this.trace(`Timer started: ${label}`);
    }

    endTimer(label) {
        const key = `timer_${label}`;
        const startKey = key + '_start';
        const endKey = key + '_end';

        performance.mark(endKey);

        try {
            performance.measure(key, startKey, endKey);
            const measure = performance.getEntriesByName(key)[0];
            const duration = measure.duration.toFixed(2);

            this.debug(`Timer ${label}: ${duration}ms`);

            // Cleanup
            performance.clearMarks(startKey);
            performance.clearMarks(endKey);
            performance.clearMeasures(key);

            return duration;
        } catch (e) {
            this.error(`Failed to measure timer ${label}`, e);
            return null;
        }
    }
}

// Create global logger instance
window.logger = new Logger('HMI', {
    logLevel: 'INFO',
    persistLogs: true,
    maxLogSize: 1000
});

// Log wrapper functions for convenience
window.logError = (message, data) => window.logger.error(message, data);
window.logWarn = (message, data) => window.logger.warn(message, data);
window.logInfo = (message, data) => window.logger.info(message, data);
window.logDebug = (message, data) => window.logger.debug(message, data);
window.logTrace = (message, data) => window.logger.trace(message, data);