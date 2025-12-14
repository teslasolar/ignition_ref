/**
 * CLI Interface for Konomi Ignaite Gitway
 * Provides command-line style interface for gateway operations
 */
class CLIInterface {
    constructor(config = {}) {
        this.config = {
            prompt: 'gateway> ',
            historySize: 100,
            outputElement: null,
            inputElement: null,
            ...config
        };

        this.history = [];
        this.historyIndex = 0;
        this.commands = new Map();
        this.logger = window.logger;

        // Initialize commands
        this.registerCommands();
    }

    registerCommands() {
        // Tag commands
        this.addCommand('tag', {
            description: 'Tag operations',
            subcommands: {
                'read': this.cmdTagRead.bind(this),
                'write': this.cmdTagWrite.bind(this),
                'list': this.cmdTagList.bind(this),
                'delete': this.cmdTagDelete.bind(this),
                'monitor': this.cmdTagMonitor.bind(this)
            }
        });

        // UDT commands
        this.addCommand('udt', {
            description: 'UDT operations',
            subcommands: {
                'list': this.cmdUDTList.bind(this),
                'create': this.cmdUDTCreate.bind(this),
                'instance': this.cmdUDTInstance.bind(this),
                'export': this.cmdUDTExport.bind(this)
            }
        });

        // View commands
        this.addCommand('view', {
            description: 'View operations',
            subcommands: {
                'list': this.cmdViewList.bind(this),
                'load': this.cmdViewLoad.bind(this),
                'reload': this.cmdViewReload.bind(this),
                'discover': this.cmdViewDiscover.bind(this)
            }
        });

        // System commands
        this.addCommand('system', {
            description: 'System operations',
            subcommands: {
                'status': this.cmdSystemStatus.bind(this),
                'info': this.cmdSystemInfo.bind(this),
                'metrics': this.cmdSystemMetrics.bind(this),
                'config': this.cmdSystemConfig.bind(this)
            }
        });

        // Log commands
        this.addCommand('log', {
            description: 'Log operations',
            subcommands: {
                'show': this.cmdLogShow.bind(this),
                'clear': this.cmdLogClear.bind(this),
                'level': this.cmdLogLevel.bind(this),
                'export': this.cmdLogExport.bind(this)
            }
        });

        // Basic commands
        this.addCommand('help', {
            handler: this.cmdHelp.bind(this),
            description: 'Show available commands'
        });

        this.addCommand('clear', {
            handler: this.cmdClear.bind(this),
            description: 'Clear the console'
        });

        this.addCommand('history', {
            handler: this.cmdHistory.bind(this),
            description: 'Show command history'
        });

        this.addCommand('exit', {
            handler: this.cmdExit.bind(this),
            description: 'Exit the CLI'
        });
    }

    addCommand(name, config) {
        this.commands.set(name, config);
    }

    // Tag commands
    async cmdTagRead(args) {
        if (args.length < 1) {
            return 'Usage: tag read <path>';
        }

        const path = args.join('/');
        const tag = window.tagManager.getTag(path);

        if (!tag) {
            return `Tag not found: ${path}`;
        }

        return this.formatTagInfo(tag);
    }

    async cmdTagWrite(args) {
        if (args.length < 2) {
            return 'Usage: tag write <path> <value>';
        }

        const valuePart = args.pop();
        const path = args.join('/');

        // Parse value
        let value;
        try {
            value = JSON.parse(valuePart);
        } catch {
            value = valuePart;
        }

        const success = window.tagManager.writeTag(path, value);

        if (success) {
            return `Tag written: ${path} = ${value}`;
        } else {
            return `Failed to write tag: ${path}`;
        }
    }

    async cmdTagList(args) {
        const pattern = args[0] || '*';
        const tags = window.tagManager.getTagsByPattern(pattern);

        if (tags.length === 0) {
            return 'No tags found';
        }

        const lines = ['Tags:', ''];
        tags.forEach(tag => {
            lines.push(`  ${tag.path} = ${tag.value} [${tag.quality}]`);
        });
        lines.push('', `Total: ${tags.length} tags`);

        return lines.join('\n');
    }

    async cmdTagDelete(args) {
        if (args.length < 1) {
            return 'Usage: tag delete <path>';
        }

        const path = args.join('/');
        const success = window.tagManager.deleteTag(path);

        if (success) {
            return `Tag deleted: ${path}`;
        } else {
            return `Tag not found: ${path}`;
        }
    }

    async cmdTagMonitor(args) {
        if (args.length < 1) {
            return 'Usage: tag monitor <path>';
        }

        const path = args.join('/');
        const tag = window.tagManager.getTag(path);

        if (!tag) {
            return `Tag not found: ${path}`;
        }

        // Set up monitoring
        const unbind = window.tagManager.bindTag(path, (value, tag) => {
            this.output(`[${new Date().toLocaleTimeString()}] ${path} = ${value}`);
        });

        // Store unbind function for cleanup
        this.currentMonitor = { path, unbind };

        return `Monitoring tag: ${path}\nPress 'q' to stop monitoring`;
    }

    // UDT commands
    async cmdUDTList(args) {
        const definitions = [];
        window.udtManager.definitions.forEach((def, name) => {
            definitions.push(`  ${name} v${def.version} - ${def.description}`);
        });

        if (definitions.length === 0) {
            return 'No UDT definitions found';
        }

        return `UDT Definitions:\n\n${definitions.join('\n')}\n\nTotal: ${definitions.length}`;
    }

    async cmdUDTCreate(args) {
        if (args.length < 3) {
            return 'Usage: udt create <type> <path> <param1=value1> ...';
        }

        const udtName = args[0];
        const path = args[1];
        const parameters = {};

        // Parse parameters
        for (let i = 2; i < args.length; i++) {
            const [key, value] = args[i].split('=');
            if (key && value) {
                parameters[key] = value;
            }
        }

        try {
            const instance = window.udtManager.createInstance(udtName, path, parameters);
            return `UDT instance created: ${path}\nType: ${udtName}\nParameters: ${JSON.stringify(parameters, null, 2)}`;
        } catch (error) {
            return `Failed to create UDT instance: ${error.message}`;
        }
    }

    async cmdUDTInstance(args) {
        const instances = [];
        window.udtManager.instances.forEach(instance => {
            instances.push(`  ${instance.path} (${instance.udtName})`);
        });

        if (instances.length === 0) {
            return 'No UDT instances found';
        }

        return `UDT Instances:\n\n${instances.join('\n')}\n\nTotal: ${instances.length}`;
    }

    async cmdUDTExport(args) {
        if (args.length < 1) {
            return 'Usage: udt export <name>';
        }

        const udtName = args[0];
        const json = window.udtManager.exportUDT(udtName);

        if (!json) {
            return `UDT not found: ${udtName}`;
        }

        return `UDT Definition: ${udtName}\n\n${json}`;
    }

    // View commands
    async cmdViewList(args) {
        const views = window.viewDiscovery?.getAllViews() || [];

        if (views.length === 0) {
            return 'No views found';
        }

        const lines = ['Available Views:', ''];
        const byCategory = {};

        views.forEach(view => {
            const category = view.category || 'Uncategorized';
            if (!byCategory[category]) {
                byCategory[category] = [];
            }
            byCategory[category].push(`    ${view.id} - ${view.name}`);
        });

        Object.keys(byCategory).sort().forEach(category => {
            lines.push(`  [${category}]`);
            lines.push(...byCategory[category]);
            lines.push('');
        });

        lines.push(`Total: ${views.length} views`);

        return lines.join('\n');
    }

    async cmdViewLoad(args) {
        if (args.length < 1) {
            return 'Usage: view load <id>';
        }

        const viewId = args[0];

        if (window.router) {
            window.router.navigate(viewId);
            return `Loading view: ${viewId}`;
        }

        return 'Router not available';
    }

    async cmdViewReload(args) {
        const viewId = args[0] || window.router?.currentView;

        if (!viewId) {
            return 'No view specified or loaded';
        }

        const success = await window.viewDiscovery?.reloadView(viewId);

        if (success) {
            return `View reloaded: ${viewId}`;
        } else {
            return `Failed to reload view: ${viewId}`;
        }
    }

    async cmdViewDiscover(args) {
        await window.viewDiscovery?.discoverViews();
        const stats = window.viewDiscovery?.getStats();

        return `View discovery completed\n\nStats:\n  Views: ${stats.viewCount}\n  Templates: ${stats.templateCount}\n  Categories: ${stats.categories}\n  Auto-discovery: ${stats.autoDiscovery ? 'Enabled' : 'Disabled'}`;
    }

    // System commands
    async cmdSystemStatus(args) {
        const response = await window.gatewayAPI.handleRequest('GET', '/api/v1/gateway/status');
        const status = response.data;

        const lines = [
            'Gateway Status',
            '==============',
            `Status: ${status.status}`,
            `Version: ${status.version}`,
            `Uptime: ${status.uptime} seconds`,
            '',
            'Modules:',
            ...Object.entries(status.modules).map(([module, state]) => `  ${module}: ${state}`),
            '',
            'Statistics:',
            ...Object.entries(status.stats).map(([key, value]) => `  ${key}: ${value}`)
        ];

        return lines.join('\n');
    }

    async cmdSystemInfo(args) {
        const response = await window.gatewayAPI.handleRequest('GET', '/api/v1/system/info');
        const info = response.data;

        const lines = [
            'System Information',
            '==================',
            `Name: ${info.name}`,
            `Version: ${info.version}`,
            `Platform: ${info.platform}`,
            `Language: ${info.language}`,
            `Online: ${info.onLine}`,
            `Screen: ${info.screenResolution}`
        ];

        return lines.join('\n');
    }

    async cmdSystemMetrics(args) {
        const response = await window.gatewayAPI.handleRequest('GET', '/api/v1/gateway/metrics');
        const metrics = response.data;

        const lines = [
            'System Metrics',
            '==============',
            `CPU: ${metrics.cpu.toFixed(1)}%`,
            `Memory: ${metrics.memory.toFixed(1)}%`,
            `Tag Updates/sec: ${metrics.tagUpdatesPerSecond}`,
            `Active Connections: ${metrics.activeConnections}`
        ];

        return lines.join('\n');
    }

    async cmdSystemConfig(args) {
        const response = await window.gatewayAPI.handleRequest('GET', '/api/v1/system/config');
        const config = response.data;

        return `System Configuration:\n\n${JSON.stringify(config, null, 2)}`;
    }

    // Log commands
    async cmdLogShow(args) {
        const level = args[0];
        const limit = parseInt(args[1]) || 20;

        const filter = level ? { level: level.toUpperCase() } : {};
        const logs = window.logger.getLogs(filter).slice(-limit);

        if (logs.length === 0) {
            return 'No logs found';
        }

        const lines = logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            return `[${time}] [${log.level}] ${log.message}`;
        });

        return lines.join('\n');
    }

    async cmdLogClear(args) {
        window.logger.clear();
        return 'Logs cleared';
    }

    async cmdLogLevel(args) {
        if (args.length < 1) {
            return `Current log level: ${window.logger.config.logLevel}\nUsage: log level <ERROR|WARN|INFO|DEBUG|TRACE>`;
        }

        const level = args[0].toUpperCase();
        window.logger.setLogLevel(level);
        return `Log level set to: ${level}`;
    }

    async cmdLogExport(args) {
        const format = args[0] || 'text';
        const filename = `logs_${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;

        window.logger.downloadLogs(filename, format);
        return `Logs exported to: ${filename}`;
    }

    // Basic commands
    async cmdHelp(args) {
        const lines = ['Available Commands:', ''];

        this.commands.forEach((config, name) => {
            if (config.subcommands) {
                lines.push(`  ${name} - ${config.description}`);
                Object.keys(config.subcommands).forEach(sub => {
                    lines.push(`    ${sub}`);
                });
            } else {
                lines.push(`  ${name} - ${config.description}`);
            }
            lines.push('');
        });

        return lines.join('\n');
    }

    async cmdClear(args) {
        if (this.config.outputElement) {
            this.config.outputElement.innerHTML = '';
        }
        return '';
    }

    async cmdHistory(args) {
        if (this.history.length === 0) {
            return 'No command history';
        }

        const lines = ['Command History:', ''];
        this.history.forEach((cmd, i) => {
            lines.push(`  ${i + 1}: ${cmd}`);
        });

        return lines.join('\n');
    }

    async cmdExit(args) {
        this.output('Goodbye!');
        if (this.config.onExit) {
            this.config.onExit();
        }
        return null;
    }

    // Helper methods
    formatTagInfo(tag) {
        const lines = [
            `Tag: ${tag.path}`,
            `Value: ${tag.value}`,
            `Type: ${tag.type}`,
            `Quality: ${tag.quality}`,
            `Timestamp: ${new Date(tag.timestamp).toLocaleString()}`
        ];

        if (tag.metadata && Object.keys(tag.metadata).length > 0) {
            lines.push('Metadata:');
            Object.entries(tag.metadata).forEach(([key, value]) => {
                lines.push(`  ${key}: ${value}`);
            });
        }

        return lines.join('\n');
    }

    // Process command
    async processCommand(input) {
        if (!input.trim()) return '';

        // Add to history
        this.history.push(input);
        if (this.history.length > this.config.historySize) {
            this.history.shift();
        }
        this.historyIndex = this.history.length;

        // Parse command
        const parts = input.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check for monitoring stop
        if (command === 'q' && this.currentMonitor) {
            this.currentMonitor.unbind();
            this.currentMonitor = null;
            return 'Monitoring stopped';
        }

        // Find and execute command
        const config = this.commands.get(command);

        if (!config) {
            return `Unknown command: ${command}\nType 'help' for available commands`;
        }

        try {
            if (config.subcommands) {
                const subcommand = args[0];
                const handler = config.subcommands[subcommand];

                if (!handler) {
                    return `Usage: ${command} <${Object.keys(config.subcommands).join('|')}>`;
                }

                return await handler(args.slice(1));
            } else {
                return await config.handler(args);
            }
        } catch (error) {
            this.logger.error(`CLI command error: ${command}`, error);
            return `Error: ${error.message}`;
        }
    }

    // Output to console
    output(text) {
        if (this.config.outputElement) {
            const line = document.createElement('div');
            line.className = 'cli-output';
            line.textContent = text;
            this.config.outputElement.appendChild(line);
            this.config.outputElement.scrollTop = this.config.outputElement.scrollHeight;
        } else {
            console.log(text);
        }
    }

    // Start CLI interface
    start() {
        this.logger.info('CLI Interface started');

        // Create global CLI access
        window.cli = this;

        // Create simple command interface
        window.runCommand = async (cmd) => {
            const result = await this.processCommand(cmd);
            if (result) {
                this.output(result);
            }
            return result;
        };

        return true;
    }

    stop() {
        if (this.currentMonitor) {
            this.currentMonitor.unbind();
        }

        delete window.cli;
        delete window.runCommand;

        this.logger.info('CLI Interface stopped');
    }
}

// Create and start the CLI interface
window.cliInterface = new CLIInterface();
window.cliInterface.start();