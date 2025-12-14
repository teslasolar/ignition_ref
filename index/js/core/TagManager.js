/**
 * TagManager - Handles tag data and bindings
 */
class TagManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.tags = new Map();
        this.bindings = new Map();
        this.simulatedTags = new Set();
        this.updateQueue = [];
        this.processing = false;

        // Initialize some default tags
        this.initializeDefaultTags();
    }

    initializeDefaultTags() {
        // System tags
        this.createTag('System/Time', new Date().toISOString(), 'string');
        this.createTag('System/Uptime', 0, 'number');
        this.createTag('System/Memory', 0, 'number');
        this.createTag('System/CPU', 0, 'number');

        // Simulated process tags
        this.createTag('Process/Temperature', 72.5, 'number', { min: 0, max: 200, units: '°F' });
        this.createTag('Process/Pressure', 45.2, 'number', { min: 0, max: 100, units: 'PSI' });
        this.createTag('Process/Flow', 125.8, 'number', { min: 0, max: 500, units: 'GPM' });
        this.createTag('Process/Level', 65.3, 'number', { min: 0, max: 100, units: '%' });

        // Equipment status tags
        this.createTag('Equipment/Pump1/Status', true, 'boolean');
        this.createTag('Equipment/Pump1/Speed', 1750, 'number', { min: 0, max: 3600, units: 'RPM' });
        this.createTag('Equipment/Pump2/Status', false, 'boolean');
        this.createTag('Equipment/Pump2/Speed', 0, 'number', { min: 0, max: 3600, units: 'RPM' });

        // Alarm tags
        this.createTag('Alarms/Active', 2, 'number');
        this.createTag('Alarms/Acknowledged', 5, 'number');
        this.createTag('Alarms/HighPriority', 0, 'number');

        // Mark process tags as simulated
        ['Process/Temperature', 'Process/Pressure', 'Process/Flow', 'Process/Level',
         'Equipment/Pump1/Speed'].forEach(path => {
            this.simulatedTags.add(path);
        });
    }

    createTag(path, initialValue, type = 'any', metadata = {}) {
        const tag = {
            path,
            value: initialValue,
            type,
            metadata,
            quality: 'Good',
            timestamp: Date.now(),
            history: []
        };

        this.tags.set(path, tag);
        return tag;
    }

    getTag(path) {
        if (!this.tags.has(path)) {
            // Auto-create tag if it doesn't exist
            this.createTag(path, null, 'any');
        }
        return this.tags.get(path);
    }

    readTag(path) {
        const tag = this.getTag(path);
        return tag ? tag.value : null;
    }

    writeTag(path, value) {
        const tag = this.getTag(path);
        if (!tag) return false;

        // Validate type
        if (tag.type !== 'any' && !this.validateType(value, tag.type)) {
            console.error(`Type mismatch for tag ${path}: expected ${tag.type}`);
            return false;
        }

        // Store previous value in history
        tag.history.push({
            value: tag.value,
            timestamp: tag.timestamp
        });

        // Limit history size
        if (tag.history.length > 100) {
            tag.history.shift();
        }

        // Update tag
        tag.value = value;
        tag.timestamp = Date.now();
        tag.quality = 'Good';

        // Queue update notification
        this.queueUpdate(path, value, tag);

        return true;
    }

    queueUpdate(path, value, tag) {
        this.updateQueue.push({ path, value, tag });

        if (!this.processing) {
            this.processing = true;
            requestAnimationFrame(() => this.processUpdateQueue());
        }
    }

    processUpdateQueue() {
        const updates = [...this.updateQueue];
        this.updateQueue = [];

        updates.forEach(({ path, value, tag }) => {
            // Notify bindings
            if (this.bindings.has(path)) {
                this.bindings.get(path).forEach(callback => {
                    try {
                        callback(value, tag);
                    } catch (error) {
                        console.error(`Error in tag binding for ${path}:`, error);
                    }
                });
            }

            // Emit event
            this.eventBus.emit('tag:update', { path, value, tag });
        });

        this.processing = false;
    }

    bindTag(path, callback) {
        if (!this.bindings.has(path)) {
            this.bindings.set(path, new Set());
        }
        this.bindings.get(path).add(callback);

        // Return unbind function
        return () => this.unbindTag(path, callback);
    }

    unbindTag(path, callback) {
        if (!this.bindings.has(path)) return;

        this.bindings.get(path).delete(callback);
        if (this.bindings.get(path).size === 0) {
            this.bindings.delete(path);
        }
    }

    validateType(value, type) {
        switch (type) {
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'string':
                return typeof value === 'string';
            case 'boolean':
                return typeof value === 'boolean';
            case 'object':
                return typeof value === 'object' && value !== null;
            case 'array':
                return Array.isArray(value);
            default:
                return true;
        }
    }

    updateSimulatedTags() {
        // Update system time
        this.writeTag('System/Time', new Date().toISOString());

        // Update system uptime
        const uptime = this.readTag('System/Uptime') || 0;
        this.writeTag('System/Uptime', uptime + 1);

        // Update simulated CPU and Memory
        this.writeTag('System/CPU', Math.random() * 30 + 20);
        this.writeTag('System/Memory', Math.random() * 20 + 60);

        // Update simulated process values
        this.simulatedTags.forEach(path => {
            const tag = this.getTag(path);
            if (tag && tag.metadata.min !== undefined && tag.metadata.max !== undefined) {
                const range = tag.metadata.max - tag.metadata.min;
                const variation = (Math.random() - 0.5) * range * 0.02; // 2% variation
                let newValue = tag.value + variation;

                // Keep within bounds
                newValue = Math.max(tag.metadata.min, Math.min(tag.metadata.max, newValue));
                this.writeTag(path, newValue);
            }
        });

        // Random alarm count changes
        if (Math.random() < 0.1) {
            const activeAlarms = this.readTag('Alarms/Active');
            this.writeTag('Alarms/Active', Math.max(0, activeAlarms + Math.floor(Math.random() * 3 - 1)));
        }
    }

    clearTags() {
        // Clear only non-system tags
        const systemPaths = Array.from(this.tags.keys()).filter(path => path.startsWith('System/'));

        this.tags.clear();
        this.bindings.clear();

        // Restore system tags
        systemPaths.forEach(path => {
            this.initializeDefaultTags();
        });

        this.eventBus.emit('tags:cleared');
    }

    getTagCount() {
        return this.tags.size;
    }

    getAllTags() {
        return Array.from(this.tags.values());
    }

    getTagsByPattern(pattern) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return Array.from(this.tags.entries())
            .filter(([path]) => regex.test(path))
            .map(([_, tag]) => tag);
    }

    exportTags() {
        const data = {};
        this.tags.forEach((tag, path) => {
            data[path] = {
                value: tag.value,
                type: tag.type,
                metadata: tag.metadata,
                quality: tag.quality
            };
        });
        return data;
    }

    importTags(data) {
        Object.entries(data).forEach(([path, tagData]) => {
            this.createTag(path, tagData.value, tagData.type, tagData.metadata);
        });
    }

    // Enhanced metadata management for UDT support
    setTagMetadata(path, metadata) {
        const tag = this.getTag(path);
        if (tag) {
            tag.metadata = { ...tag.metadata, ...metadata };
            return true;
        }
        return false;
    }

    deleteTag(path) {
        if (this.tags.has(path)) {
            // Remove bindings
            if (this.bindings.has(path)) {
                this.bindings.delete(path);
            }
            // Remove tag
            this.tags.delete(path);
            // Emit event
            this.eventBus.emit('tag:deleted', { path });
            return true;
        }
        return false;
    }

    // Get all tags under a specific path (for UDT management)
    getTagsUnderPath(basePath) {
        const results = [];
        this.tags.forEach((tag, path) => {
            if (path.startsWith(basePath + '/')) {
                results.push(tag);
            }
        });
        return results;
    }
}