/**
 * UDTManager - User Defined Types for tag templates
 * Similar to Ignition's UDT system for creating reusable tag structures
 */
class UDTManager {
    constructor(tagManager, logger) {
        this.tagManager = tagManager;
        this.logger = logger || window.logger;
        this.definitions = new Map();
        this.instances = new Map();

        // Initialize standard UDTs
        this.initializeStandardUDTs();
    }

    initializeStandardUDTs() {
        // Motor UDT
        this.registerUDT({
            name: 'Motor',
            version: '1.0',
            description: 'Standard motor control UDT',
            parameters: {
                MotorName: {
                    type: 'String',
                    defaultValue: 'Motor'
                },
                MaxSpeed: {
                    type: 'Number',
                    defaultValue: 1800
                }
            },
            tags: {
                Status: {
                    type: 'Boolean',
                    defaultValue: false,
                    description: 'Motor running status'
                },
                Speed: {
                    type: 'Number',
                    defaultValue: 0,
                    min: 0,
                    max: '{MaxSpeed}',
                    units: 'RPM',
                    description: 'Motor speed'
                },
                Current: {
                    type: 'Number',
                    defaultValue: 0,
                    units: 'Amps',
                    description: 'Motor current draw'
                },
                Temperature: {
                    type: 'Number',
                    defaultValue: 0,
                    units: '°F',
                    description: 'Motor temperature'
                },
                RunHours: {
                    type: 'Number',
                    defaultValue: 0,
                    units: 'Hours',
                    description: 'Total run hours'
                },
                Faulted: {
                    type: 'Boolean',
                    defaultValue: false,
                    description: 'Motor fault status'
                },
                FaultCode: {
                    type: 'Number',
                    defaultValue: 0,
                    description: 'Current fault code'
                },
                Commands: {
                    type: 'Folder',
                    tags: {
                        Start: {
                            type: 'Boolean',
                            defaultValue: false,
                            description: 'Start command'
                        },
                        Stop: {
                            type: 'Boolean',
                            defaultValue: false,
                            description: 'Stop command'
                        },
                        Reset: {
                            type: 'Boolean',
                            defaultValue: false,
                            description: 'Reset fault'
                        }
                    }
                },
                Setpoints: {
                    type: 'Folder',
                    tags: {
                        Speed: {
                            type: 'Number',
                            defaultValue: 0,
                            min: 0,
                            max: '{MaxSpeed}',
                            units: 'RPM',
                            description: 'Speed setpoint'
                        }
                    }
                }
            }
        });

        // Valve UDT
        this.registerUDT({
            name: 'Valve',
            version: '1.0',
            description: 'Standard valve control UDT',
            parameters: {
                ValveName: {
                    type: 'String',
                    defaultValue: 'Valve'
                },
                ValveType: {
                    type: 'String',
                    defaultValue: 'Ball'
                }
            },
            tags: {
                Position: {
                    type: 'Number',
                    defaultValue: 0,
                    min: 0,
                    max: 100,
                    units: '%',
                    description: 'Valve position'
                },
                OpenStatus: {
                    type: 'Boolean',
                    defaultValue: false,
                    description: 'Valve fully open'
                },
                ClosedStatus: {
                    type: 'Boolean',
                    defaultValue: true,
                    description: 'Valve fully closed'
                },
                Faulted: {
                    type: 'Boolean',
                    defaultValue: false,
                    description: 'Valve fault status'
                },
                Commands: {
                    type: 'Folder',
                    tags: {
                        Open: {
                            type: 'Boolean',
                            defaultValue: false,
                            description: 'Open command'
                        },
                        Close: {
                            type: 'Boolean',
                            defaultValue: false,
                            description: 'Close command'
                        }
                    }
                }
            }
        });

        // Tank UDT
        this.registerUDT({
            name: 'Tank',
            version: '1.0',
            description: 'Storage tank monitoring UDT',
            parameters: {
                TankName: {
                    type: 'String',
                    defaultValue: 'Tank'
                },
                MaxCapacity: {
                    type: 'Number',
                    defaultValue: 10000
                },
                Units: {
                    type: 'String',
                    defaultValue: 'Gallons'
                }
            },
            tags: {
                Level: {
                    type: 'Number',
                    defaultValue: 0,
                    min: 0,
                    max: 100,
                    units: '%',
                    description: 'Tank level percentage'
                },
                Volume: {
                    type: 'Number',
                    defaultValue: 0,
                    units: '{Units}',
                    expression: '{Level} * {MaxCapacity} / 100',
                    description: 'Tank volume'
                },
                Temperature: {
                    type: 'Number',
                    defaultValue: 0,
                    units: '°F',
                    description: 'Tank temperature'
                },
                Pressure: {
                    type: 'Number',
                    defaultValue: 0,
                    units: 'PSI',
                    description: 'Tank pressure'
                },
                Alarms: {
                    type: 'Folder',
                    tags: {
                        HighLevel: {
                            type: 'Boolean',
                            defaultValue: false,
                            expression: '{Level} > 90',
                            description: 'High level alarm'
                        },
                        LowLevel: {
                            type: 'Boolean',
                            defaultValue: false,
                            expression: '{Level} < 10',
                            description: 'Low level alarm'
                        },
                        HighTemp: {
                            type: 'Boolean',
                            defaultValue: false,
                            expression: '{Temperature} > 150',
                            description: 'High temperature alarm'
                        }
                    }
                }
            }
        });

        // PID Loop UDT
        this.registerUDT({
            name: 'PIDLoop',
            version: '1.0',
            description: 'PID control loop UDT',
            parameters: {
                LoopName: {
                    type: 'String',
                    defaultValue: 'PID Loop'
                },
                Units: {
                    type: 'String',
                    defaultValue: ''
                }
            },
            tags: {
                PV: {
                    type: 'Number',
                    defaultValue: 0,
                    units: '{Units}',
                    description: 'Process variable'
                },
                SP: {
                    type: 'Number',
                    defaultValue: 0,
                    units: '{Units}',
                    description: 'Setpoint'
                },
                CV: {
                    type: 'Number',
                    defaultValue: 0,
                    min: 0,
                    max: 100,
                    units: '%',
                    description: 'Control variable output'
                },
                Mode: {
                    type: 'String',
                    defaultValue: 'Manual',
                    description: 'Control mode (Manual/Auto/Cascade)'
                },
                Tuning: {
                    type: 'Folder',
                    tags: {
                        Kp: {
                            type: 'Number',
                            defaultValue: 1.0,
                            description: 'Proportional gain'
                        },
                        Ki: {
                            type: 'Number',
                            defaultValue: 0.1,
                            description: 'Integral gain'
                        },
                        Kd: {
                            type: 'Number',
                            defaultValue: 0.0,
                            description: 'Derivative gain'
                        }
                    }
                }
            }
        });

        this.logger.info('Standard UDTs initialized', {
            count: this.definitions.size,
            types: Array.from(this.definitions.keys())
        });
    }

    registerUDT(definition) {
        if (!definition.name) {
            throw new Error('UDT definition must have a name');
        }

        this.definitions.set(definition.name, {
            ...definition,
            registeredAt: new Date()
        });

        this.logger.debug(`UDT registered: ${definition.name}`);
        return true;
    }

    createInstance(udtName, instancePath, parameters = {}) {
        const definition = this.definitions.get(udtName);
        if (!definition) {
            throw new Error(`UDT '${udtName}' not found`);
        }

        // Merge parameters with defaults
        const resolvedParams = {};
        if (definition.parameters) {
            for (const [key, param] of Object.entries(definition.parameters)) {
                resolvedParams[key] = parameters[key] !== undefined ?
                    parameters[key] : param.defaultValue;
            }
        }

        // Create tag structure
        const tags = this.createTagStructure(definition.tags, instancePath, resolvedParams);

        // Register instance
        const instance = {
            udtName,
            path: instancePath,
            parameters: resolvedParams,
            tags,
            createdAt: new Date()
        };

        this.instances.set(instancePath, instance);

        // Create actual tags in TagManager
        this.createTagsInManager(tags, instancePath);

        this.logger.info(`UDT instance created: ${instancePath}`, {
            type: udtName,
            parameters: resolvedParams
        });

        return instance;
    }

    createTagStructure(tagDef, basePath, parameters) {
        const result = {};

        for (const [tagName, config] of Object.entries(tagDef)) {
            const fullPath = `${basePath}/${tagName}`;

            if (config.type === 'Folder') {
                result[tagName] = {
                    type: 'Folder',
                    tags: this.createTagStructure(config.tags, fullPath, parameters)
                };
            } else {
                // Resolve parameter references in config
                let resolvedConfig = { ...config };

                // Replace parameter references in string values
                for (const [key, value] of Object.entries(resolvedConfig)) {
                    if (typeof value === 'string') {
                        resolvedConfig[key] = this.resolveParameters(value, parameters);
                    }
                }

                result[tagName] = {
                    path: fullPath,
                    ...resolvedConfig
                };
            }
        }

        return result;
    }

    resolveParameters(value, parameters) {
        return value.replace(/\{(\w+)\}/g, (match, paramName) => {
            return parameters[paramName] !== undefined ?
                parameters[paramName] : match;
        });
    }

    createTagsInManager(tags, basePath) {
        for (const [tagName, config] of Object.entries(tags)) {
            if (config.type === 'Folder') {
                // Recursively create folder contents
                this.createTagsInManager(config.tags, `${basePath}/${tagName}`);
            } else {
                // Create actual tag
                const tagPath = config.path || `${basePath}/${tagName}`;

                // Set initial value
                let initialValue = config.defaultValue;
                if (config.expression) {
                    // For expressions, we'll need to evaluate them
                    // For now, just use default value
                    initialValue = config.defaultValue;
                }

                this.tagManager.writeTag(tagPath, initialValue);

                // Store metadata
                this.tagManager.setTagMetadata(tagPath, {
                    description: config.description,
                    units: config.units,
                    min: config.min,
                    max: config.max,
                    udtInstance: basePath,
                    expression: config.expression
                });
            }
        }
    }

    getInstance(path) {
        return this.instances.get(path);
    }

    getInstancesByType(udtName) {
        return Array.from(this.instances.values()).filter(
            instance => instance.udtName === udtName
        );
    }

    deleteInstance(path) {
        const instance = this.instances.get(path);
        if (!instance) {
            return false;
        }

        // Delete all tags under this instance
        this.deleteTagsInManager(instance.tags, path);

        // Remove instance
        this.instances.delete(path);

        this.logger.info(`UDT instance deleted: ${path}`);
        return true;
    }

    deleteTagsInManager(tags, basePath) {
        for (const [tagName, config] of Object.entries(tags)) {
            if (config.type === 'Folder') {
                this.deleteTagsInManager(config.tags, `${basePath}/${tagName}`);
            } else {
                const tagPath = config.path || `${basePath}/${tagName}`;
                this.tagManager.deleteTag(tagPath);
            }
        }
    }

    exportUDT(udtName) {
        const definition = this.definitions.get(udtName);
        if (!definition) {
            return null;
        }

        return JSON.stringify(definition, null, 2);
    }

    importUDT(jsonString) {
        try {
            const definition = JSON.parse(jsonString);
            this.registerUDT(definition);
            return true;
        } catch (error) {
            this.logger.error('Failed to import UDT', error);
            return false;
        }
    }

    getStats() {
        return {
            definitionCount: this.definitions.size,
            instanceCount: this.instances.size,
            definitions: Array.from(this.definitions.keys()),
            instancesByType: {}
        };
    }
}

// Create global UDT manager instance
if (window.tagManager) {
    window.udtManager = new UDTManager(window.tagManager, window.logger);
    window.logger.info('UDT Manager initialized');
}