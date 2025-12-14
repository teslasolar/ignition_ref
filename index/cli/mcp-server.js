/**
 * MCP (Model Context Protocol) Server Wrapper
 * Provides MCP-compatible interface for Konomi Ignaite Gitway
 * Integrates with the wrapper log system
 */
class MCPServerWrapper {
    constructor(config = {}) {
        this.config = {
            serverName: 'konomi-ignaite-gateway',
            version: '1.0.0',
            capabilities: ['tags', 'views', 'logs', 'udts'],
            logToWrapper: true,
            ...config
        };

        this.logger = window.logger;
        this.handlers = new Map();
        this.sessions = new Map();

        // Initialize handlers
        this.setupHandlers();

        // Log initialization
        this.logger.info('MCP Server Wrapper initialized', {
            serverName: this.config.serverName,
            capabilities: this.config.capabilities
        });
    }

    setupHandlers() {
        // Core MCP handlers
        this.registerHandler('initialize', this.handleInitialize.bind(this));
        this.registerHandler('list_tools', this.handleListTools.bind(this));
        this.registerHandler('execute_tool', this.handleExecuteTool.bind(this));

        // Tag management handlers
        this.registerHandler('read_tag', this.handleReadTag.bind(this));
        this.registerHandler('write_tag', this.handleWriteTag.bind(this));
        this.registerHandler('list_tags', this.handleListTags.bind(this));
        this.registerHandler('subscribe_tag', this.handleSubscribeTag.bind(this));

        // View management handlers
        this.registerHandler('list_views', this.handleListViews.bind(this));
        this.registerHandler('get_view', this.handleGetView.bind(this));
        this.registerHandler('navigate_view', this.handleNavigateView.bind(this));

        // UDT handlers
        this.registerHandler('list_udts', this.handleListUDTs.bind(this));
        this.registerHandler('create_udt_instance', this.handleCreateUDTInstance.bind(this));

        // Log handlers
        this.registerHandler('get_logs', this.handleGetLogs.bind(this));
        this.registerHandler('clear_logs', this.handleClearLogs.bind(this));
        this.registerHandler('set_log_level', this.handleSetLogLevel.bind(this));

        // System handlers
        this.registerHandler('get_status', this.handleGetStatus.bind(this));
        this.registerHandler('get_metrics', this.handleGetMetrics.bind(this));
    }

    registerHandler(method, handler) {
        this.handlers.set(method, handler);
    }

    // Core MCP handlers
    async handleInitialize(params) {
        const sessionId = this.generateSessionId();
        const session = {
            id: sessionId,
            clientInfo: params.clientInfo,
            startTime: new Date(),
            subscriptions: new Set()
        };

        this.sessions.set(sessionId, session);

        this.logger.info('MCP session initialized', {
            sessionId,
            client: params.clientInfo?.name
        });

        return {
            protocolVersion: '1.0',
            serverInfo: {
                name: this.config.serverName,
                version: this.config.version,
                capabilities: this.config.capabilities
            },
            sessionId
        };
    }

    async handleListTools(params) {
        return {
            tools: [
                {
                    name: 'read_tag',
                    description: 'Read a tag value',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Tag path' }
                        },
                        required: ['path']
                    }
                },
                {
                    name: 'write_tag',
                    description: 'Write a tag value',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Tag path' },
                            value: { description: 'Value to write' }
                        },
                        required: ['path', 'value']
                    }
                },
                {
                    name: 'list_tags',
                    description: 'List available tags',
                    parameters: {
                        type: 'object',
                        properties: {
                            pattern: { type: 'string', description: 'Pattern to match (optional)' }
                        }
                    }
                },
                {
                    name: 'navigate_view',
                    description: 'Navigate to a view',
                    parameters: {
                        type: 'object',
                        properties: {
                            viewId: { type: 'string', description: 'View ID' }
                        },
                        required: ['viewId']
                    }
                },
                {
                    name: 'get_logs',
                    description: 'Get system logs',
                    parameters: {
                        type: 'object',
                        properties: {
                            level: { type: 'string', enum: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'] },
                            limit: { type: 'number', description: 'Maximum number of logs' }
                        }
                    }
                }
            ]
        };
    }

    async handleExecuteTool(params) {
        const { name, parameters } = params;

        this.logger.debug(`MCP tool execution: ${name}`, parameters);

        switch (name) {
            case 'read_tag':
                return this.handleReadTag(parameters);
            case 'write_tag':
                return this.handleWriteTag(parameters);
            case 'list_tags':
                return this.handleListTags(parameters);
            case 'navigate_view':
                return this.handleNavigateView(parameters);
            case 'get_logs':
                return this.handleGetLogs(parameters);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }

    // Tag handlers
    async handleReadTag(params) {
        const tag = window.tagManager.getTag(params.path);

        if (!tag) {
            throw new Error(`Tag not found: ${params.path}`);
        }

        this.logToWrapper('READ_TAG', { path: params.path, value: tag.value });

        return {
            path: tag.path,
            value: tag.value,
            quality: tag.quality,
            timestamp: tag.timestamp,
            metadata: tag.metadata
        };
    }

    async handleWriteTag(params) {
        const success = window.tagManager.writeTag(params.path, params.value);

        if (!success) {
            throw new Error(`Failed to write tag: ${params.path}`);
        }

        this.logToWrapper('WRITE_TAG', { path: params.path, value: params.value });

        return {
            success: true,
            path: params.path,
            value: params.value
        };
    }

    async handleListTags(params) {
        const pattern = params.pattern || '*';
        const tags = window.tagManager.getTagsByPattern(pattern);

        return {
            tags: tags.map(tag => ({
                path: tag.path,
                value: tag.value,
                type: tag.type,
                quality: tag.quality
            })),
            count: tags.length
        };
    }

    async handleSubscribeTag(params) {
        const { sessionId, path } = params;
        const session = this.sessions.get(sessionId);

        if (!session) {
            throw new Error('Invalid session');
        }

        // Create subscription
        const unbind = window.tagManager.bindTag(path, (value, tag) => {
            this.sendNotification(sessionId, 'tag_update', {
                path: tag.path,
                value: value,
                timestamp: tag.timestamp
            });
        });

        session.subscriptions.add({ path, unbind });

        this.logToWrapper('SUBSCRIBE_TAG', { sessionId, path });

        return { subscribed: true, path };
    }

    // View handlers
    async handleListViews(params) {
        const views = window.viewDiscovery?.getAllViews() || [];

        return {
            views: views.map(v => ({
                id: v.id,
                name: v.name,
                description: v.description,
                category: v.category
            })),
            count: views.length
        };
    }

    async handleGetView(params) {
        const view = window.viewDiscovery?.getView(params.viewId);

        if (!view) {
            throw new Error(`View not found: ${params.viewId}`);
        }

        return view;
    }

    async handleNavigateView(params) {
        if (window.router) {
            window.router.navigate(params.viewId);
            this.logToWrapper('NAVIGATE_VIEW', { viewId: params.viewId });
            return { navigated: true, viewId: params.viewId };
        }

        throw new Error('Router not available');
    }

    // UDT handlers
    async handleListUDTs(params) {
        const definitions = [];
        window.udtManager.definitions.forEach((def, name) => {
            definitions.push({
                name: name,
                version: def.version,
                description: def.description,
                parameters: def.parameters
            });
        });

        return { udts: definitions, count: definitions.length };
    }

    async handleCreateUDTInstance(params) {
        const { udtName, path, parameters } = params;

        try {
            const instance = window.udtManager.createInstance(udtName, path, parameters);
            this.logToWrapper('CREATE_UDT_INSTANCE', { udtName, path });
            return instance;
        } catch (error) {
            throw new Error(`Failed to create UDT instance: ${error.message}`);
        }
    }

    // Log handlers
    async handleGetLogs(params) {
        const filter = {
            level: params.level,
            search: params.search
        };

        const logs = window.logger.getLogs(filter);
        const limit = params.limit || 100;

        return {
            logs: logs.slice(-limit).map(log => ({
                timestamp: log.timestamp,
                level: log.level,
                message: log.message,
                source: log.source,
                data: log.data
            })),
            count: logs.length
        };
    }

    async handleClearLogs(params) {
        window.logger.clear();
        this.logToWrapper('CLEAR_LOGS', {});
        return { cleared: true };
    }

    async handleSetLogLevel(params) {
        window.logger.setLogLevel(params.level);
        this.logToWrapper('SET_LOG_LEVEL', { level: params.level });
        return { level: params.level, set: true };
    }

    // System handlers
    async handleGetStatus(params) {
        return {
            status: 'Running',
            uptime: window.tagManager?.readTag('System/Uptime') || 0,
            sessions: this.sessions.size,
            timestamp: new Date().toISOString(),
            stats: {
                tagCount: window.tagManager?.getTagCount() || 0,
                viewCount: window.viewDiscovery?.getAllViews().length || 0,
                udtCount: window.udtManager?.definitions.size || 0
            }
        };
    }

    async handleGetMetrics(params) {
        return {
            cpu: window.tagManager?.readTag('System/CPU') || 0,
            memory: window.tagManager?.readTag('System/Memory') || 0,
            tagUpdatesPerSecond: 0,
            activeSessions: this.sessions.size,
            timestamp: new Date().toISOString()
        };
    }

    // Helper methods
    generateSessionId() {
        return 'mcp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logToWrapper(action, data) {
        if (this.config.logToWrapper) {
            this.logger.info(`MCP: ${action}`, data);
        }
    }

    sendNotification(sessionId, type, data) {
        // In a real implementation, this would send via WebSocket
        // For now, just log the notification
        this.logger.debug(`MCP notification to ${sessionId}: ${type}`, data);
    }

    // Process incoming MCP message
    async processMessage(message) {
        const { id, method, params } = message;

        try {
            const handler = this.handlers.get(method);
            if (!handler) {
                throw new Error(`Unknown method: ${method}`);
            }

            const result = await handler(params);

            return {
                id,
                result
            };
        } catch (error) {
            this.logger.error(`MCP error processing ${method}`, error);

            return {
                id,
                error: {
                    code: -32603,
                    message: error.message
                }
            };
        }
    }

    // Cleanup session
    closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            // Unbind all subscriptions
            session.subscriptions.forEach(sub => {
                if (sub.unbind) sub.unbind();
            });

            this.sessions.delete(sessionId);
            this.logger.info(`MCP session closed: ${sessionId}`);
        }
    }

    // Start MCP server
    start() {
        // In a browser environment, expose via global
        window.mcpServer = this;

        // Create a simple message interface
        window.mcpSend = async (method, params = {}) => {
            const message = {
                id: Date.now(),
                method,
                params
            };

            return await this.processMessage(message);
        };

        this.logger.info('MCP Server started', {
            serverName: this.config.serverName,
            handlers: this.handlers.size
        });

        return true;
    }

    stop() {
        // Close all sessions
        this.sessions.forEach((session, id) => {
            this.closeSession(id);
        });

        delete window.mcpServer;
        delete window.mcpSend;

        this.logger.info('MCP Server stopped');
    }
}

// Create and start the MCP server
window.mcpServerWrapper = new MCPServerWrapper();
window.mcpServerWrapper.start();