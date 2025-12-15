/**
 * LiveValueTester - Comprehensive testing for live values across all views
 * Tests tag bindings, value updates, and view rendering
 */
class LiveValueTester {
    constructor(logger) {
        this.logger = logger || window.logger;
        this.testResults = new Map();
        this.viewTests = {
            'overview': {
                name: 'System Overview',
                tagChecks: [
                    { path: 'Process/Temperature', expectedType: 'number', range: [60, 180] },
                    { path: 'Process/Pressure', expectedType: 'number', range: [30, 70] },
                    { path: 'Process/Flow', expectedType: 'number', range: [100, 150] },
                    { path: 'Process/Level', expectedType: 'number', range: [10, 90] },
                    { path: 'Equipment/Pump1/Status', expectedType: 'boolean' },
                    { path: 'Equipment/Pump1/Speed', expectedType: 'number', range: [0, 3600] },
                    { path: 'Equipment/Pump2/Status', expectedType: 'boolean' },
                    { path: 'Equipment/Pump2/Speed', expectedType: 'number', range: [0, 3600] },
                    { path: 'System/Uptime', expectedType: 'number', range: [0, Infinity] },
                    { path: 'System/CPU', expectedType: 'number', range: [0, 100] },
                    { path: 'System/Memory', expectedType: 'number', range: [0, 100] }
                ],
                domChecks: [
                    { selector: '.gauge', minCount: 4, description: 'Gauge components' },
                    { selector: '.table', minCount: 1, description: 'Information tables' },
                    { selector: '.button', minCount: 2, description: 'Control buttons' }
                ]
            },
            'process': {
                name: 'Process Control',
                tagChecks: [
                    { path: 'Process/Temperature', expectedType: 'number', range: [60, 180] },
                    { path: 'Process/Pressure', expectedType: 'number', range: [30, 70] },
                    { path: 'Process/Flow', expectedType: 'number', range: [100, 150] },
                    { path: 'Process/Level', expectedType: 'number', range: [10, 90] }
                ],
                domChecks: [
                    { selector: '.gauge', minCount: 4, description: 'Process gauges' },
                    { selector: '.numeric-input', minCount: 1, description: 'Input controls' }
                ]
            },
            'equipment': {
                name: 'Equipment Status',
                tagChecks: [
                    { path: 'Equipment/Pump1/Status', expectedType: 'boolean' },
                    { path: 'Equipment/Pump1/Speed', expectedType: 'number', range: [0, 3600] },
                    { path: 'Equipment/Pump2/Status', expectedType: 'boolean' },
                    { path: 'Equipment/Pump2/Speed', expectedType: 'number', range: [0, 3600] }
                ],
                domChecks: [
                    { selector: '.button', minCount: 2, description: 'Equipment controls' },
                    { selector: '.label', minCount: 4, description: 'Status labels' }
                ]
            },
            'alarms': {
                name: 'Alarms',
                tagChecks: [
                    { path: 'Alarms/Active', expectedType: 'number', range: [0, 100] },
                    { path: 'Alarms/Acknowledged', expectedType: 'number', range: [0, 100] },
                    { path: 'Alarms/HighPriority', expectedType: 'number', range: [0, 100] }
                ],
                domChecks: [
                    { selector: '.table', minCount: 1, description: 'Alarm table' },
                    { selector: '.button', minCount: 2, description: 'Alarm controls' }
                ]
            },
            'trends': {
                name: 'Trends',
                tagChecks: [],
                domChecks: [
                    { selector: '.chart', minCount: 2, description: 'Trend charts' },
                    { selector: 'canvas', minCount: 2, description: 'Chart canvases' }
                ]
            },
            'gateway': {
                name: 'Gateway Management',
                tagChecks: [
                    { path: 'Factory/Gateway/CPULoad', expectedType: 'number', range: [0, 100] },
                    { path: 'Factory/Gateway/MemoryUsage', expectedType: 'number', range: [0, 100] },
                    { path: 'Factory/Gateway/ConnectionCount', expectedType: 'number', range: [0, 1000] }
                ],
                domChecks: [
                    { selector: '.table', minCount: 2, description: 'Status tables' },
                    { selector: '.button', minCount: 3, description: 'Action buttons' }
                ]
            },
            'diagnostics': {
                name: 'System Diagnostics',
                tagChecks: [
                    { path: 'System/CPU', expectedType: 'number', range: [0, 100] },
                    { path: 'System/Memory', expectedType: 'number', range: [0, 100] },
                    { path: 'System/Uptime', expectedType: 'number', range: [0, Infinity] }
                ],
                domChecks: [
                    { selector: '.gauge', minCount: 3, description: 'Performance gauges' },
                    { selector: '.chart', minCount: 1, description: 'Performance chart' },
                    { selector: '.table', minCount: 2, description: 'Info tables' }
                ]
            },
            'tag-browser': {
                name: 'Tag Browser',
                tagChecks: [],
                domChecks: [
                    { selector: '.table', minCount: 1, description: 'Tag table' },
                    { selector: '.button', minCount: 4, description: 'Management buttons' },
                    { selector: '.numeric-input', minCount: 1, description: 'Value editor' }
                ]
            },
            'api-reference': {
                name: 'API Reference',
                tagChecks: [],
                domChecks: [
                    { selector: '.api-endpoint', minCount: 3, description: 'API endpoints' },
                    { selector: '.mcp-tool', minCount: 3, description: 'MCP tools' },
                    { selector: '.code-example', minCount: 6, description: 'Code examples' }
                ]
            },
            'factory-dashboard': {
                name: 'Factory Dashboard',
                tagChecks: [
                    { path: 'Factory/Stats/TotalFiles', expectedType: 'number', expectedValue: 47 },
                    { path: 'Factory/Stats/TotalLOC', expectedType: 'number', expectedValue: 8926 },
                    { path: 'Factory/Stats/TotalComponents', expectedType: 'number', expectedValue: 98 },
                    { path: 'Factory/Production/Efficiency', expectedType: 'number', range: [80, 100] },
                    { path: 'Factory/Process/Temperature', expectedType: 'number', range: [60, 180] },
                    { path: 'Factory/Process/Pressure', expectedType: 'number', range: [30, 70] },
                    { path: 'Factory/Process/Flow', expectedType: 'number', range: [100, 150] }
                ],
                domChecks: [
                    { selector: '.gauge', minCount: 3, description: 'Process gauges' },
                    { selector: '.table', minCount: 2, description: 'Metrics tables' }
                ]
            }
        };
    }

    /**
     * Test all views for live values
     */
    async testAllViews() {
        this.logger.info('=== Starting Live Value Test Suite ===');

        const allResults = {
            timestamp: new Date(),
            totalViews: Object.keys(this.viewTests).length,
            passed: 0,
            failed: 0,
            warnings: 0,
            results: []
        };

        // Test each view
        for (const [viewId, config] of Object.entries(this.viewTests)) {
            const result = await this.testView(viewId, config);
            allResults.results.push(result);

            if (result.passed) {
                allResults.passed++;
            } else {
                allResults.failed++;
            }

            if (result.warnings > 0) {
                allResults.warnings += result.warnings;
            }
        }

        // Generate report
        this.generateReport(allResults);

        return allResults;
    }

    /**
     * Test a single view
     */
    async testView(viewId, config) {
        this.logger.info(`Testing view: ${config.name} (${viewId})`);

        const result = {
            viewId,
            viewName: config.name,
            timestamp: new Date(),
            passed: true,
            warnings: 0,
            tagTests: [],
            domTests: [],
            errors: []
        };

        try {
            // Load the view
            if (window.router && viewId !== 'factory-dashboard') {
                window.router.navigate(viewId);
                await this.wait(1000); // Wait for view to load
            }

            // Test tags
            for (const tagCheck of config.tagChecks) {
                const tagResult = await this.testTag(tagCheck);
                result.tagTests.push(tagResult);

                if (!tagResult.passed) {
                    result.passed = false;
                    this.logger.error(`Tag test failed for ${tagCheck.path}`, tagResult);
                } else if (tagResult.warning) {
                    result.warnings++;
                    this.logger.warn(`Tag warning for ${tagCheck.path}`, tagResult);
                }
            }

            // Test DOM elements (only for current view)
            if (viewId === window.router?.currentView || viewId === 'factory-dashboard') {
                for (const domCheck of config.domChecks) {
                    const domResult = await this.testDOMElements(domCheck);
                    result.domTests.push(domResult);

                    if (!domResult.passed) {
                        result.passed = false;
                        this.logger.error(`DOM test failed: ${domCheck.description}`, domResult);
                    }
                }
            }

            // Test value changes over time
            const changeResult = await this.testValueChanges(config.tagChecks);
            result.valueChanges = changeResult;

        } catch (error) {
            result.passed = false;
            result.errors.push(error.toString());
            this.logger.error(`Error testing view ${viewId}`, error);
        }

        // Store result
        this.testResults.set(viewId, result);

        // Log summary
        const status = result.passed ? '✓ PASSED' : '✗ FAILED';
        const warningText = result.warnings > 0 ? ` (${result.warnings} warnings)` : '';
        this.logger.info(`${config.name}: ${status}${warningText}`);

        return result;
    }

    /**
     * Test a single tag
     */
    async testTag(tagCheck) {
        const tag = window.tagManager.getTag(tagCheck.path);
        const result = {
            path: tagCheck.path,
            passed: true,
            warning: false,
            value: null,
            type: null,
            quality: null,
            details: []
        };

        if (!tag) {
            result.passed = false;
            result.details.push(`Tag not found: ${tagCheck.path}`);
            return result;
        }

        result.value = tag.value;
        result.type = typeof tag.value;
        result.quality = tag.quality;

        // Check type
        if (tagCheck.expectedType && result.type !== tagCheck.expectedType) {
            result.passed = false;
            result.details.push(`Type mismatch: expected ${tagCheck.expectedType}, got ${result.type}`);
        }

        // Check specific value
        if (tagCheck.expectedValue !== undefined) {
            if (tag.value !== tagCheck.expectedValue) {
                result.passed = false;
                result.details.push(`Value mismatch: expected ${tagCheck.expectedValue}, got ${tag.value}`);
            }
        }

        // Check range
        if (tagCheck.range && typeof tag.value === 'number') {
            if (tag.value < tagCheck.range[0] || tag.value > tagCheck.range[1]) {
                result.warning = true;
                result.details.push(`Value ${tag.value} outside expected range [${tagCheck.range[0]}, ${tagCheck.range[1]}]`);
            }
        }

        // Check quality
        if (tag.quality !== 'Good') {
            result.warning = true;
            result.details.push(`Tag quality is ${tag.quality}`);
        }

        return result;
    }

    /**
     * Test DOM elements
     */
    async testDOMElements(domCheck) {
        const elements = document.querySelectorAll(domCheck.selector);
        const result = {
            selector: domCheck.selector,
            description: domCheck.description,
            passed: true,
            found: elements.length,
            expected: domCheck.minCount
        };

        if (elements.length < domCheck.minCount) {
            result.passed = false;
            result.details = `Found ${elements.length} elements, expected at least ${domCheck.minCount}`;
        }

        return result;
    }

    /**
     * Test that values change over time (for live data)
     */
    async testValueChanges(tagChecks) {
        const dynamicTags = tagChecks.filter(tc =>
            tc.path.includes('Temperature') ||
            tc.path.includes('Pressure') ||
            tc.path.includes('Flow') ||
            tc.path.includes('Level') ||
            tc.path.includes('CPU') ||
            tc.path.includes('Memory')
        );

        if (dynamicTags.length === 0) {
            return { tested: false };
        }

        const initialValues = {};
        dynamicTags.forEach(tc => {
            const tag = window.tagManager.getTag(tc.path);
            if (tag) {
                initialValues[tc.path] = tag.value;
            }
        });

        // Wait for values to change
        await this.wait(2500);

        const changedValues = {};
        let changedCount = 0;

        dynamicTags.forEach(tc => {
            const tag = window.tagManager.getTag(tc.path);
            if (tag) {
                changedValues[tc.path] = tag.value;
                if (initialValues[tc.path] !== tag.value) {
                    changedCount++;
                }
            }
        });

        return {
            tested: true,
            totalTags: dynamicTags.length,
            changed: changedCount,
            percentage: (changedCount / dynamicTags.length * 100).toFixed(1),
            initialValues,
            changedValues
        };
    }

    /**
     * Wait helper
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate test report
     */
    generateReport(results) {
        this.logger.info('=== Live Value Test Report ===');
        this.logger.info(`Total Views Tested: ${results.totalViews}`);
        this.logger.info(`Passed: ${results.passed}`);
        this.logger.info(`Failed: ${results.failed}`);
        this.logger.info(`Warnings: ${results.warnings}`);

        // Detailed results
        results.results.forEach(viewResult => {
            const status = viewResult.passed ? '✓' : '✗';
            this.logger.info(`${status} ${viewResult.viewName}:`);

            // Tag test summary
            if (viewResult.tagTests.length > 0) {
                const passedTags = viewResult.tagTests.filter(t => t.passed).length;
                this.logger.info(`  Tags: ${passedTags}/${viewResult.tagTests.length} passed`);

                // Show failed tags
                viewResult.tagTests.filter(t => !t.passed).forEach(t => {
                    this.logger.error(`    ✗ ${t.path}: ${t.details.join(', ')}`);
                });
            }

            // DOM test summary
            if (viewResult.domTests.length > 0) {
                const passedDOM = viewResult.domTests.filter(t => t.passed).length;
                this.logger.info(`  DOM: ${passedDOM}/${viewResult.domTests.length} passed`);
            }

            // Value change test
            if (viewResult.valueChanges && viewResult.valueChanges.tested) {
                this.logger.info(`  Live Updates: ${viewResult.valueChanges.changed}/${viewResult.valueChanges.totalTags} values changed (${viewResult.valueChanges.percentage}%)`);
            }
        });

        // Overall status
        const overallStatus = results.failed === 0 ? 'ALL TESTS PASSED ✓' : 'TESTS FAILED ✗';
        this.logger.info(`=== ${overallStatus} ===`);

        return results;
    }

    /**
     * Quick test for current view
     */
    async testCurrentView() {
        const currentView = window.router?.currentView || 'overview';
        const config = this.viewTests[currentView];

        if (!config) {
            this.logger.error(`No test configuration for view: ${currentView}`);
            return null;
        }

        return await this.testView(currentView, config);
    }
}

// Create global tester instance
window.liveValueTester = new LiveValueTester(window.logger);

// Add test command
if (window.runCommand) {
    // Make test available via CLI
    window.testLiveValues = async () => {
        return await window.liveValueTester.testAllViews();
    };

    window.testCurrentView = async () => {
        return await window.liveValueTester.testCurrentView();
    };
}

window.logger.info('Live Value Tester initialized - Run window.testLiveValues() to test all views');