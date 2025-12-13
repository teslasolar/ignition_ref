/**
 * EventBus - Central event management system
 */
class EventBus {
    constructor() {
        this.events = new Map();
        this.eventLog = [];
        this.maxLogSize = 100;
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }

        if (callbacks.length === 0) {
            this.events.delete(event);
        }
    }

    emit(event, data = {}) {
        // Log event
        this.logEvent(event, data);

        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    once(event, callback) {
        const wrapper = (data) => {
            this.off(event, wrapper);
            callback(data);
        };
        this.on(event, wrapper);
    }

    clear() {
        this.events.clear();
        this.eventLog = [];
    }

    logEvent(event, data) {
        this.eventLog.push({
            event,
            data,
            timestamp: Date.now()
        });

        // Maintain max log size
        if (this.eventLog.length > this.maxLogSize) {
            this.eventLog.shift();
        }
    }

    getEventLog() {
        return this.eventLog;
    }

    getListenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }

    getAllEvents() {
        return Array.from(this.events.keys());
    }
}