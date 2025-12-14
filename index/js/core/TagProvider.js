/**
 * TagProvider - Maps tags to views and provides factory metrics
 * Treats the repository as a factory with real production metrics
 */
class TagProvider {
    constructor(tagManager, logger) {
        this.tagManager = tagManager;
        this.logger = logger || window.logger;

        // Define tag directories for each view (view as production line)
        this.viewTagMappings = {
            'overview': {
                name: 'Overview Production Line',
                tags: [
                    'Factory/Production/TotalOutput',
                    'Factory/Production/Efficiency',
                    'Factory/Production/Quality',
                    'Factory/Lines/Overview/Status',
                    'Factory/Lines/Overview/Uptime',
                    'Factory/Lines/Overview/CycleTime'
                ],
                metrics: {
                    filesCount: 5,
                    linesOfCode: 433,
                    componentCount: 12,
                    dataBindings: 4
                }
            },
            'process': {
                name: 'Process Control Line',
                tags: [
                    'Factory/Process/Temperature',
                    'Factory/Process/Pressure',
                    'Factory/Process/Flow',
                    'Factory/Process/Level',
                    'Factory/Lines/Process/Status',
                    'Factory/Lines/Process/BatchCount',
                    'Factory/Lines/Process/RecipeActive'
                ],
                metrics: {
                    filesCount: 3,
                    linesOfCode: 298,
                    componentCount: 8,
                    dataBindings: 6
                }
            },
            'equipment': {
                name: 'Equipment Assembly Line',
                tags: [
                    'Factory/Equipment/Motor1/Speed',
                    'Factory/Equipment/Motor1/Current',
                    'Factory/Equipment/Motor1/Temperature',
                    'Factory/Equipment/Motor2/Speed',
                    'Factory/Equipment/Motor2/Current',
                    'Factory/Equipment/Conveyor/Speed',
                    'Factory/Lines/Equipment/Status',
                    'Factory/Lines/Equipment/OEE'
                ],
                metrics: {
                    filesCount: 4,
                    linesOfCode: 412,
                    componentCount: 10,
                    dataBindings: 8
                }
            },
            'alarms': {
                name: 'Quality Control Station',
                tags: [
                    'Factory/QC/ActiveAlarms',
                    'Factory/QC/AcknowledgedAlarms',
                    'Factory/QC/HighPriorityAlarms',
                    'Factory/QC/DefectRate',
                    'Factory/Lines/QC/InspectionRate',
                    'Factory/Lines/QC/RejectionRate'
                ],
                metrics: {
                    filesCount: 2,
                    linesOfCode: 187,
                    componentCount: 5,
                    dataBindings: 3
                }
            },
            'trends': {
                name: 'Analytics Production',
                tags: [
                    'Factory/Analytics/DataPointsPerSecond',
                    'Factory/Analytics/HistorianLoad',
                    'Factory/Analytics/TrendCount',
                    'Factory/Lines/Analytics/ProcessingTime',
                    'Factory/Lines/Analytics/DataQuality'
                ],
                metrics: {
                    filesCount: 2,
                    linesOfCode: 85,
                    componentCount: 3,
                    dataBindings: 2
                }
            },
            'gateway': {
                name: 'Factory Management Center',
                tags: [
                    'Factory/Gateway/ConnectionCount',
                    'Factory/Gateway/MessageRate',
                    'Factory/Gateway/CPULoad',
                    'Factory/Gateway/MemoryUsage',
                    'Factory/Gateway/NetworkBandwidth',
                    'Factory/Lines/Gateway/Uptime',
                    'Factory/Lines/Gateway/RequestsPerSecond'
                ],
                metrics: {
                    filesCount: 8,
                    linesOfCode: 895,
                    componentCount: 15,
                    dataBindings: 7
                }
            },
            'diagnostics': {
                name: 'Maintenance Department',
                tags: [
                    'Factory/Maintenance/MTBF',
                    'Factory/Maintenance/MTTR',
                    'Factory/Maintenance/PreventiveTasks',
                    'Factory/Maintenance/OpenWorkOrders',
                    'Factory/Lines/Diagnostics/ScanRate',
                    'Factory/Lines/Diagnostics/ErrorCount'
                ],
                metrics: {
                    filesCount: 3,
                    linesOfCode: 542,
                    componentCount: 9,
                    dataBindings: 6
                }
            },
            'tag-browser': {
                name: 'Inventory Management',
                tags: [
                    'Factory/Inventory/TotalTags',
                    'Factory/Inventory/ActiveTags',
                    'Factory/Inventory/StaleTagCount',
                    'Factory/Inventory/TagUpdateRate',
                    'Factory/Lines/TagBrowser/ScanTime'
                ],
                metrics: {
                    filesCount: 4,
                    linesOfCode: 623,
                    componentCount: 11,
                    dataBindings: 4
                }
            },
            'api-reference': {
                name: 'Integration Services',
                tags: [
                    'Factory/API/RequestCount',
                    'Factory/API/ResponseTime',
                    'Factory/API/ErrorRate',
                    'Factory/API/ActiveSessions',
                    'Factory/MCP/ToolExecutions',
                    'Factory/CLI/CommandsProcessed'
                ],
                metrics: {
                    filesCount: 6,
                    linesOfCode: 1420,
                    componentCount: 18,
                    dataBindings: 0
                }
            }
        };

        // Repository factory metrics
        this.factoryMetrics = {
            totalFiles: 47,
            totalLinesOfCode: 8926,
            totalComponents: 98,
            totalViews: 9,
            totalUDTs: 4,
            commitCount: 15,
            lastDeployment: new Date(),
            productionRate: 0,
            qualityScore: 95,
            efficiency: 88
        };

        // Initialize factory tags
        this.initializeFactoryTags();

        // Start factory production simulation
        this.startFactorySimulation();
    }

    initializeFactoryTags() {
        // Create factory-wide tags
        this.tagManager.createTag('Factory/Info/Name', 'Konomi Ignaite Gitway', 'string');
        this.tagManager.createTag('Factory/Info/Version', '1.0.0', 'string');
        this.tagManager.createTag('Factory/Info/Location', 'GitHub Pages', 'string');
        this.tagManager.createTag('Factory/Info/Repository', 'teslasolar/ignition_ref', 'string');

        // Production metrics with initial values
        this.tagManager.createTag('Factory/Production/TotalOutput', 127.5, 'number', {
            units: 'views/hour',
            description: 'Total view renders per hour'
        });
        this.tagManager.createTag('Factory/Production/Efficiency', 88, 'number', {
            units: '%',
            min: 0,
            max: 100,
            description: 'Overall factory efficiency'
        });
        this.tagManager.createTag('Factory/Production/Quality', 95, 'number', {
            units: '%',
            min: 0,
            max: 100,
            description: 'Code quality score'
        });

        // Repository metrics as factory stats - USE ACTUAL VALUES
        this.tagManager.createTag('Factory/Stats/TotalFiles', 47, 'number');
        this.tagManager.createTag('Factory/Stats/TotalLOC', 8926, 'number');
        this.tagManager.createTag('Factory/Stats/TotalComponents', 98, 'number');
        this.tagManager.createTag('Factory/Stats/CommitCount', 18, 'number');

        // Create tags for each view/production line
        Object.entries(this.viewTagMappings).forEach(([viewId, config]) => {
            // Production line status
            this.tagManager.createTag(`Factory/Lines/${viewId}/Status`, 'Idle', 'string');
            this.tagManager.createTag(`Factory/Lines/${viewId}/Uptime`, 0, 'number', {
                units: 'seconds'
            });
            this.tagManager.createTag(`Factory/Lines/${viewId}/CycleTime`, 0, 'number', {
                units: 'ms',
                description: 'Render time for this view'
            });

            // View-specific metrics as production data
            this.tagManager.createTag(`Factory/Lines/${viewId}/FilesCount`, config.metrics.filesCount, 'number');
            this.tagManager.createTag(`Factory/Lines/${viewId}/LOC`, config.metrics.linesOfCode, 'number');
            this.tagManager.createTag(`Factory/Lines/${viewId}/Components`, config.metrics.componentCount, 'number');
            this.tagManager.createTag(`Factory/Lines/${viewId}/Bindings`, config.metrics.dataBindings, 'number');

            // Create all mapped tags for this view
            config.tags.forEach(tagPath => {
                if (!this.tagManager.getTag(tagPath)) {
                    const value = this.getInitialTagValue(tagPath);
                    const type = typeof value === 'boolean' ? 'boolean' :
                                typeof value === 'number' ? 'number' : 'string';

                    this.tagManager.createTag(tagPath, value, type, {
                        viewId: viewId,
                        productionLine: config.name
                    });
                }
            });
        });

        // Process control tags - CREATE BOTH Factory/ AND original paths for backward compatibility
        this.tagManager.createTag('Factory/Process/Temperature', 72.5, 'number', {
            units: '°F',
            min: 0,
            max: 200
        });
        this.tagManager.createTag('Process/Temperature', 72.5, 'number', {
            units: '°F',
            min: 0,
            max: 200
        });

        this.tagManager.createTag('Factory/Process/Pressure', 45.2, 'number', {
            units: 'PSI',
            min: 0,
            max: 100
        });
        this.tagManager.createTag('Process/Pressure', 45.2, 'number', {
            units: 'PSI',
            min: 0,
            max: 100
        });

        this.tagManager.createTag('Factory/Process/Flow', 125.8, 'number', {
            units: 'GPM',
            min: 0,
            max: 500
        });
        this.tagManager.createTag('Process/Flow', 125.8, 'number', {
            units: 'GPM',
            min: 0,
            max: 500
        });

        this.tagManager.createTag('Factory/Process/Level', 65.3, 'number', {
            units: '%',
            min: 0,
            max: 100
        });
        this.tagManager.createTag('Process/Level', 65.3, 'number', {
            units: '%',
            min: 0,
            max: 100
        });

        // Equipment tags - CREATE BOTH paths
        this.tagManager.createTag('Factory/Equipment/Motor1/Speed', 1750, 'number', {
            units: 'RPM',
            min: 0,
            max: 3600
        });
        this.tagManager.createTag('Equipment/Pump1/Speed', 1750, 'number', {
            units: 'RPM',
            min: 0,
            max: 3600
        });

        this.tagManager.createTag('Equipment/Pump1/Status', true, 'boolean');
        this.tagManager.createTag('Equipment/Pump2/Status', false, 'boolean');
        this.tagManager.createTag('Equipment/Pump2/Speed', 0, 'number', {
            units: 'RPM',
            min: 0,
            max: 3600
        });

        this.tagManager.createTag('Factory/Equipment/Motor1/Current', 45.5, 'number', {
            units: 'A',
            min: 0,
            max: 100
        });
        this.tagManager.createTag('Factory/Equipment/Motor1/Temperature', 145, 'number', {
            units: '°F',
            min: 0,
            max: 300
        });

        // Alarm tags for compatibility
        this.tagManager.createTag('Alarms/Active', 2, 'number');
        this.tagManager.createTag('Alarms/Acknowledged', 5, 'number');
        this.tagManager.createTag('Alarms/HighPriority', 0, 'number');

        // Gateway metrics
        this.tagManager.createTag('Factory/Gateway/ConnectionCount', 1, 'number');
        this.tagManager.createTag('Factory/Gateway/MessageRate', 0, 'number', {
            units: 'msg/sec'
        });
        this.tagManager.createTag('Factory/Gateway/CPULoad', 25, 'number', {
            units: '%',
            min: 0,
            max: 100
        });
        this.tagManager.createTag('Factory/Gateway/MemoryUsage', 68, 'number', {
            units: '%',
            min: 0,
            max: 100
        });

        // API metrics
        this.tagManager.createTag('Factory/API/RequestCount', 0, 'number');
        this.tagManager.createTag('Factory/API/ResponseTime', 0, 'number', {
            units: 'ms'
        });
        this.tagManager.createTag('Factory/API/ErrorRate', 0, 'number', {
            units: '%',
            min: 0,
            max: 100
        });

        this.logger.info('Factory tag provider initialized', {
            totalTags: this.tagManager.getTagCount(),
            productionLines: Object.keys(this.viewTagMappings).length
        });
    }

    getInitialTagValue(tagPath) {
        // Return appropriate initial values based on tag path
        if (tagPath.includes('Status')) return 'Idle';
        if (tagPath.includes('Count')) return 0;
        if (tagPath.includes('Rate')) return 0;
        if (tagPath.includes('Time')) return 0;
        if (tagPath.includes('Speed')) return 0;
        if (tagPath.includes('Temperature')) return 70;
        if (tagPath.includes('Pressure')) return 50;
        if (tagPath.includes('Level')) return 50;
        if (tagPath.includes('Quality')) return 95;
        if (tagPath.includes('Efficiency')) return 85;
        return 0;
    }

    startFactorySimulation() {
        // Simulate factory production
        setInterval(() => {
            this.updateFactoryMetrics();
        }, 1000);

        // Simulate production line updates
        setInterval(() => {
            this.updateProductionLines();
        }, 2000);
    }

    updateFactoryMetrics() {
        // Update production output (views rendered per hour)
        const currentOutput = this.tagManager.readTag('Factory/Production/TotalOutput') || 0;
        const variation = (Math.random() - 0.5) * 10;
        const newOutput = Math.max(0, currentOutput + variation);
        this.tagManager.writeTag('Factory/Production/TotalOutput', newOutput);

        // Update efficiency
        const efficiency = 85 + Math.random() * 10;
        this.tagManager.writeTag('Factory/Production/Efficiency', efficiency);

        // Update process variables
        this.simulateProcessVariables();

        // Update API metrics
        this.updateAPIMetrics();
    }

    simulateProcessVariables() {
        // Temperature variation - UPDATE BOTH paths
        const temp = this.tagManager.readTag('Factory/Process/Temperature') || 72.5;
        const newTemp = temp + (Math.random() - 0.5) * 2;
        const clampedTemp = Math.max(60, Math.min(180, newTemp));
        this.tagManager.writeTag('Factory/Process/Temperature', clampedTemp);
        this.tagManager.writeTag('Process/Temperature', clampedTemp);

        // Pressure variation - UPDATE BOTH paths
        const pressure = this.tagManager.readTag('Factory/Process/Pressure') || 45.2;
        const newPressure = pressure + (Math.random() - 0.5) * 1;
        const clampedPressure = Math.max(30, Math.min(70, newPressure));
        this.tagManager.writeTag('Factory/Process/Pressure', clampedPressure);
        this.tagManager.writeTag('Process/Pressure', clampedPressure);

        // Flow variation - UPDATE BOTH paths
        const flow = this.tagManager.readTag('Factory/Process/Flow') || 125.8;
        const newFlow = flow + (Math.random() - 0.5) * 5;
        const clampedFlow = Math.max(100, Math.min(150, newFlow));
        this.tagManager.writeTag('Factory/Process/Flow', clampedFlow);
        this.tagManager.writeTag('Process/Flow', clampedFlow);

        // Level variation - UPDATE BOTH paths
        const level = this.tagManager.readTag('Factory/Process/Level') || 65.3;
        const newLevel = level + (Math.random() - 0.5) * 3;
        const clampedLevel = Math.max(10, Math.min(90, newLevel));
        this.tagManager.writeTag('Factory/Process/Level', clampedLevel);
        this.tagManager.writeTag('Process/Level', clampedLevel);

        // Update equipment speeds
        if (this.tagManager.readTag('Equipment/Pump1/Status')) {
            const speed = 1750 + (Math.random() - 0.5) * 100;
            this.tagManager.writeTag('Equipment/Pump1/Speed', speed);
            this.tagManager.writeTag('Factory/Equipment/Motor1/Speed', speed);
        }

        if (this.tagManager.readTag('Equipment/Pump2/Status')) {
            const speed = 1750 + (Math.random() - 0.5) * 100;
            this.tagManager.writeTag('Equipment/Pump2/Speed', speed);
        }
    }

    updateProductionLines() {
        Object.keys(this.viewTagMappings).forEach(viewId => {
            const uptimePath = `Factory/Lines/${viewId}/Uptime`;
            const currentUptime = this.tagManager.readTag(uptimePath) || 0;
            this.tagManager.writeTag(uptimePath, currentUptime + 2);
        });
    }

    updateAPIMetrics() {
        // Simulate API request count
        const requests = this.tagManager.readTag('Factory/API/RequestCount') || 0;
        if (Math.random() > 0.7) {
            this.tagManager.writeTag('Factory/API/RequestCount', requests + 1);
        }

        // Simulate response time
        const responseTime = 20 + Math.random() * 30;
        this.tagManager.writeTag('Factory/API/ResponseTime', responseTime);
    }

    /**
     * Get tags associated with a specific view
     */
    getViewTags(viewId) {
        const mapping = this.viewTagMappings[viewId];
        if (!mapping) {
            return [];
        }

        return mapping.tags.map(tagPath => {
            const tag = this.tagManager.getTag(tagPath);
            return {
                path: tagPath,
                value: tag ? tag.value : null,
                quality: tag ? tag.quality : 'Bad',
                metadata: tag ? tag.metadata : {}
            };
        });
    }

    /**
     * Get production metrics for a view
     */
    getViewMetrics(viewId) {
        const mapping = this.viewTagMappings[viewId];
        if (!mapping) {
            return null;
        }

        return {
            name: mapping.name,
            metrics: mapping.metrics,
            status: this.tagManager.readTag(`Factory/Lines/${viewId}/Status`),
            uptime: this.tagManager.readTag(`Factory/Lines/${viewId}/Uptime`),
            cycleTime: this.tagManager.readTag(`Factory/Lines/${viewId}/CycleTime`)
        };
    }

    /**
     * Update view production status
     */
    updateViewStatus(viewId, status, cycleTime) {
        this.tagManager.writeTag(`Factory/Lines/${viewId}/Status`, status);
        if (cycleTime !== undefined) {
            this.tagManager.writeTag(`Factory/Lines/${viewId}/CycleTime`, cycleTime);
        }

        // Log production event
        this.logger.info(`Production line ${viewId} status: ${status}`, {
            cycleTime: cycleTime,
            tags: this.viewTagMappings[viewId]?.tags.length
        });
    }

    /**
     * Get factory summary
     */
    getFactorySummary() {
        return {
            name: 'Konomi Ignaite Gitway Factory',
            repository: 'teslasolar/ignition_ref',
            metrics: this.factoryMetrics,
            productionLines: Object.keys(this.viewTagMappings).map(id => ({
                id: id,
                name: this.viewTagMappings[id].name,
                status: this.tagManager.readTag(`Factory/Lines/${id}/Status`),
                uptime: this.tagManager.readTag(`Factory/Lines/${id}/Uptime`)
            })),
            totalTags: this.tagManager.getTagCount(),
            efficiency: this.tagManager.readTag('Factory/Production/Efficiency'),
            quality: this.tagManager.readTag('Factory/Production/Quality')
        };
    }
}

// Create global tag provider instance
if (window.tagManager) {
    window.tagProvider = new TagProvider(window.tagManager, window.logger);

    // Hook into view rendering to update production status
    if (window.eventBus) {
        window.eventBus.on('view:loading', (data) => {
            window.tagProvider.updateViewStatus(data.viewId, 'Running');
        });

        window.eventBus.on('view:loaded', (data) => {
            window.tagProvider.updateViewStatus(data.viewId, 'Idle', data.renderTime);
        });

        window.eventBus.on('view:error', (data) => {
            window.tagProvider.updateViewStatus(data.viewId, 'Faulted');
        });
    }

    window.logger.info('Tag Provider Factory System initialized', {
        productionLines: Object.keys(window.tagProvider.viewTagMappings).length,
        factoryMetrics: window.tagProvider.factoryMetrics
    });
}