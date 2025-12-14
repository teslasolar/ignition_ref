/**
 * API Server for Konomi Ignaite Gitway
 * Provides REST API endpoints for tag management, view control, and gateway operations
 */
class GatewayAPIServer {
    constructor(config = {}) {
        this.config = {
            port: 8089,
            host: 'localhost',
            basePath: '/api/v1',
            corsEnabled: true,
            authRequired: false,
            ...config
        };

        this.routes = new Map();
        this.middleware = [];
        this.logger = window.logger || console;

        // Initialize routes
        this.setupRoutes();
    }

    setupRoutes() {
        // Tag API routes
        this.addRoute('GET', '/tags', this.getTags.bind(this));
        this.addRoute('GET', '/tags/:path', this.getTag.bind(this));
        this.addRoute('POST', '/tags/:path', this.writeTag.bind(this));
        this.addRoute('DELETE', '/tags/:path', this.deleteTag.bind(this));
        this.addRoute('GET', '/tags/:path/history', this.getTagHistory.bind(this));

        // UDT API routes
        this.addRoute('GET', '/udts', this.getUDTs.bind(this));
        this.addRoute('POST', '/udts', this.createUDT.bind(this));
        this.addRoute('GET', '/udts/:name', this.getUDT.bind(this));
        this.addRoute('POST', '/udts/:name/instances', this.createUDTInstance.bind(this));
        this.addRoute('GET', '/udts/instances', this.getUDTInstances.bind(this));

        // View API routes
        this.addRoute('GET', '/views', this.getViews.bind(this));
        this.addRoute('GET', '/views/:id', this.getView.bind(this));
        this.addRoute('POST', '/views/:id', this.updateView.bind(this));
        this.addRoute('POST', '/views/:id/reload', this.reloadView.bind(this));

        // Gateway API routes
        this.addRoute('GET', '/gateway/status', this.getGatewayStatus.bind(this));
        this.addRoute('GET', '/gateway/logs', this.getGatewayLogs.bind(this));
        this.addRoute('POST', '/gateway/logs/clear', this.clearLogs.bind(this));
        this.addRoute('GET', '/gateway/metrics', this.getMetrics.bind(this));

        // System API routes
        this.addRoute('GET', '/system/info', this.getSystemInfo.bind(this));
        this.addRoute('GET', '/system/config', this.getConfig.bind(this));
        this.addRoute('POST', '/system/config', this.updateConfig.bind(this));

        this.logger.info('API routes initialized', {
            routeCount: this.routes.size,
            basePath: this.config.basePath
        });
    }

    addRoute(method, path, handler) {
        const key = `${method}:${this.config.basePath}${path}`;
        this.routes.set(key, handler);
    }

    // Tag API handlers
    async getTags(req) {
        const pattern = req.query?.pattern || '*';
        const tags = window.tagManager.getTagsByPattern(pattern);

        return {
            status: 200,
            data: {
                tags: tags.map(tag => ({
                    path: tag.path,
                    value: tag.value,
                    quality: tag.quality,
                    timestamp: tag.timestamp,
                    metadata: tag.metadata
                })),
                count: tags.length
            }
        };
    }

    async getTag(req) {
        const path = req.params.path.replace(/\$/g, '/');
        const tag = window.tagManager.getTag(path);

        if (!tag) {
            return { status: 404, error: 'Tag not found' };
        }

        return {
            status: 200,
            data: {
                path: tag.path,
                value: tag.value,
                quality: tag.quality,
                timestamp: tag.timestamp,
                metadata: tag.metadata,
                history: tag.history.slice(-10)
            }
        };
    }

    async writeTag(req) {
        const path = req.params.path.replace(/\$/g, '/');
        const { value } = req.body;

        const success = window.tagManager.writeTag(path, value);

        if (!success) {
            return { status: 400, error: 'Failed to write tag' };
        }

        this.logger.info(`Tag written via API: ${path} = ${value}`);

        return {
            status: 200,
            data: { path, value, success: true }
        };
    }

    async deleteTag(req) {
        const path = req.params.path.replace(/\$/g, '/');
        const success = window.tagManager.deleteTag(path);

        if (!success) {
            return { status: 404, error: 'Tag not found' };
        }

        return {
            status: 200,
            data: { path, deleted: true }
        };
    }

    async getTagHistory(req) {
        const path = req.params.path.replace(/\$/g, '/');
        const tag = window.tagManager.getTag(path);

        if (!tag) {
            return { status: 404, error: 'Tag not found' };
        }

        return {
            status: 200,
            data: {
                path: tag.path,
                history: tag.history
            }
        };
    }

    // UDT API handlers
    async getUDTs(req) {
        const stats = window.udtManager.getStats();
        const definitions = [];

        window.udtManager.definitions.forEach((def, name) => {
            definitions.push({
                name: name,
                version: def.version,
                description: def.description,
                parameters: def.parameters,
                tagCount: Object.keys(def.tags).length
            });
        });

        return {
            status: 200,
            data: {
                definitions,
                stats
            }
        };
    }

    async createUDT(req) {
        const definition = req.body;

        try {
            window.udtManager.registerUDT(definition);
            return {
                status: 201,
                data: { name: definition.name, created: true }
            };
        } catch (error) {
            return { status: 400, error: error.message };
        }
    }

    async getUDT(req) {
        const name = req.params.name;
        const definition = window.udtManager.definitions.get(name);

        if (!definition) {
            return { status: 404, error: 'UDT not found' };
        }

        return {
            status: 200,
            data: definition
        };
    }

    async createUDTInstance(req) {
        const udtName = req.params.name;
        const { path, parameters } = req.body;

        try {
            const instance = window.udtManager.createInstance(udtName, path, parameters);
            return {
                status: 201,
                data: instance
            };
        } catch (error) {
            return { status: 400, error: error.message };
        }
    }

    async getUDTInstances(req) {
        const instances = [];
        window.udtManager.instances.forEach(instance => {
            instances.push({
                path: instance.path,
                udtName: instance.udtName,
                parameters: instance.parameters,
                createdAt: instance.createdAt
            });
        });

        return {
            status: 200,
            data: { instances, count: instances.length }
        };
    }

    // View API handlers
    async getViews(req) {
        const views = window.viewDiscovery?.getAllViews() || [];

        return {
            status: 200,
            data: {
                views: views.map(v => ({
                    id: v.id,
                    name: v.name,
                    description: v.description,
                    category: v.category,
                    loadTime: v.loadTime
                })),
                count: views.length
            }
        };
    }

    async getView(req) {
        const id = req.params.id;
        const view = window.viewDiscovery?.getView(id);

        if (!view) {
            return { status: 404, error: 'View not found' };
        }

        return {
            status: 200,
            data: view
        };
    }

    async updateView(req) {
        const id = req.params.id;
        const viewData = req.body;

        // In a real implementation, this would save the view
        // For now, we'll just validate and return success
        return {
            status: 200,
            data: { id, updated: true }
        };
    }

    async reloadView(req) {
        const id = req.params.id;
        const success = await window.viewDiscovery?.reloadView(id);

        if (!success) {
            return { status: 404, error: 'View not found or reload failed' };
        }

        return {
            status: 200,
            data: { id, reloaded: true }
        };
    }

    // Gateway API handlers
    async getGatewayStatus(req) {
        return {
            status: 200,
            data: {
                status: 'Running',
                version: '1.0.0',
                uptime: window.tagManager?.readTag('System/Uptime') || 0,
                timestamp: new Date().toISOString(),
                modules: {
                    tags: 'Active',
                    views: 'Active',
                    udts: 'Active',
                    api: 'Active'
                },
                stats: {
                    tagCount: window.tagManager?.getTagCount() || 0,
                    viewCount: window.viewDiscovery?.getAllViews().length || 0,
                    udtCount: window.udtManager?.definitions.size || 0,
                    activeBindings: window.tagManager?.bindings.size || 0
                }
            }
        };
    }

    async getGatewayLogs(req) {
        const filter = {
            level: req.query?.level,
            startTime: req.query?.startTime,
            endTime: req.query?.endTime,
            search: req.query?.search
        };

        const logs = window.logger?.getLogs(filter) || [];

        return {
            status: 200,
            data: {
                logs: logs.slice(-100),
                count: logs.length
            }
        };
    }

    async clearLogs(req) {
        window.logger?.clear();

        return {
            status: 200,
            data: { cleared: true }
        };
    }

    async getMetrics(req) {
        return {
            status: 200,
            data: {
                cpu: window.tagManager?.readTag('System/CPU') || 0,
                memory: window.tagManager?.readTag('System/Memory') || 0,
                tagUpdatesPerSecond: 0,
                activeConnections: 1,
                timestamp: new Date().toISOString()
            }
        };
    }

    // System API handlers
    async getSystemInfo(req) {
        return {
            status: 200,
            data: {
                name: 'Konomi Ignaite Gitway',
                version: '1.0.0',
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                language: navigator.language,
                onLine: navigator.onLine,
                screenResolution: `${screen.width}x${screen.height}`,
                timestamp: new Date().toISOString()
            }
        };
    }

    async getConfig(req) {
        const config = JSON.parse(localStorage.getItem('gatewayConfig') || '{}');

        return {
            status: 200,
            data: config
        };
    }

    async updateConfig(req) {
        const config = req.body;
        localStorage.setItem('gatewayConfig', JSON.stringify(config));

        return {
            status: 200,
            data: { updated: true }
        };
    }

    // Handle incoming API request
    async handleRequest(method, path, body = null, query = {}) {
        const routeKey = `${method}:${path}`;
        const handler = this.routes.get(routeKey);

        if (!handler) {
            // Try to match with parameters
            for (const [key, h] of this.routes) {
                const pattern = key.replace(/:(\w+)/g, '([^/]+)');
                const regex = new RegExp(`^${pattern}$`);
                const match = routeKey.match(regex);

                if (match) {
                    const params = {};
                    const parts = key.split('/');
                    const pathParts = path.split('/');

                    parts.forEach((part, i) => {
                        if (part.startsWith(':')) {
                            params[part.slice(1)] = pathParts[i];
                        }
                    });

                    const req = { method, path, body, query, params };
                    return await h(req);
                }
            }

            return { status: 404, error: 'Route not found' };
        }

        const req = { method, path, body, query, params: {} };
        return await handler(req);
    }

    // Start the API server (simulated for browser environment)
    start() {
        // In a browser environment, we can't actually start a server
        // Instead, we expose the API through a global object
        window.gatewayAPI = this;

        // Also create a fetch-like interface
        window.gatewayFetch = async (path, options = {}) => {
            const method = options.method || 'GET';
            const body = options.body ? JSON.parse(options.body) : null;

            // Parse query string
            const url = new URL(path, 'http://localhost');
            const query = {};
            url.searchParams.forEach((value, key) => {
                query[key] = value;
            });

            const response = await this.handleRequest(
                method,
                url.pathname,
                body,
                query
            );

            return {
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                json: async () => response.data || response
            };
        };

        this.logger.info('Gateway API Server started', {
            routes: this.routes.size,
            basePath: this.config.basePath
        });

        return true;
    }

    stop() {
        delete window.gatewayAPI;
        delete window.gatewayFetch;
        this.logger.info('Gateway API Server stopped');
    }
}

// Create and start the API server
window.gatewayAPIServer = new GatewayAPIServer();
window.gatewayAPIServer.start();