/**
 * AcceptanceTests - Standard acceptance tests for all views
 * Tests run automatically when views load and log to wrapper
 */
class AcceptanceTests {
    constructor(logger) {
        this.logger = logger || window.logger;
        this.testResults = new Map();
        this.criticalFailures = [];

        // Define acceptance criteria for each view
        this.viewCriteria = {
            'overview': {
                name: 'System Overview',
                tests: [
                    { id: 'gauges', description: 'All gauges must render', selector: '.gauge' },
                    { id: 'tables', description: 'System info tables must load', selector: '.table' },
                    { id: 'buttons', description: 'Control buttons must be present', selector: '.button' },
                    { id: 'bindings', description: 'Tag bindings must be active', check: () => window.tagManager.bindings.size > 0 }
                ]
            },
            'process': {
                name: 'Process Control',
                tests: [
                    { id: 'controls', description: 'Process controls must render', selector: '.container' },
                    { id: 'values', description: 'Process values must display', selector: '.label' },
                    { id: 'inputs', description: 'Numeric inputs must be functional', selector: '.numeric-input' }
                ]
            },
            'equipment': {
                name: 'Equipment Status',
                tests: [
                    { id: 'status', description: 'Equipment status must display', selector: '.label' },
                    { id: 'controls', description: 'Equipment controls must render', selector: '.button' },
                    { id: 'indicators', description: 'Status indicators must be visible', check: () => true }
                ]
            },
            'alarms': {
                name: 'Alarms',
                tests: [
                    { id: 'table', description: 'Alarm table must render', selector: '.table' },
                    { id: 'buttons', description: 'Acknowledgment buttons must exist', selector: '.button' },
                    { id: 'filters', description: 'Filter controls must be present', check: () => true }
                ]
            },
            'trends': {
                name: 'Trends',
                tests: [
                    { id: 'charts', description: 'Chart components must render', selector: '.chart' },
                    { id: 'canvas', description: 'Canvas element must exist', selector: 'canvas' },
                    { id: 'labels', description: 'Chart labels must be present', selector: '.label' }
                ]
            },
            'gateway': {
                name: 'Gateway Management',
                tests: [
                    { id: 'status', description: 'Gateway status must display', selector: '.table' },
                    { id: 'actions', description: 'Quick actions must be available', selector: '.button' },
                    { id: 'logs', description: 'Log container must exist', selector: '#log-container' },
                    { id: 'modules', description: 'Module status must show', check: () => window.udtManager !== undefined }
                ]
            },
            'diagnostics': {
                name: 'System Diagnostics',
                tests: [
                    { id: 'gauges', description: 'Performance gauges must render', selector: '.gauge' },
                    { id: 'metrics', description: 'Metrics chart must display', selector: '.chart' },
                    { id: 'info', description: 'System info tables must load', selector: '.table' }
                ]
            },
            'tag-browser': {
                name: 'Tag Browser',
                tests: [
                    { id: 'folders', description: 'Tag folders must display', selector: '.container' },
                    { id: 'table', description: 'Tag table must render', selector: '.table' },
                    { id: 'properties', description: 'Properties panel must exist', selector: '.numeric-input' },
                    { id: 'tags', description: 'Tags must be accessible', check: () => window.tagManager.getTagCount() > 0 }
                ]
            },
            'api-reference': {
                name: 'API Reference',
                tests: [
                    { id: 'endpoints', description: 'API endpoints must be documented', selector: '.api-endpoint' },
                    { id: 'examples', description: 'Code examples must render', selector: '.code-example' },
                    { id: 'mcp', description: 'MCP tools must be listed', selector: '.mcp-tool' },
                    { id: 'api', description: 'API server must be running', check: () => window.gatewayAPI !== undefined }
                ]
            }
        };
    }

    /**
     * Run acceptance tests for a specific view
     */
    async runViewTests(viewId) {
        const criteria = this.viewCriteria[viewId];
        if (!criteria) {
            this.logger.warn(`No acceptance tests defined for view: ${viewId}`);
            return { passed: true, skipped: true };
        }

        this.logger.info(`Running acceptance tests for: ${criteria.name}`);

        const results = {
            viewId,
            viewName: criteria.name,
            timestamp: new Date(),
            tests: [],
            passed: true
        };

        // Wait for view to fully render
        await this.waitForRender();

        // Run each test
        for (const test of criteria.tests) {
            const testResult = await this.runSingleTest(test);
            results.tests.push({
                ...test,
                ...testResult
            });

            if (!testResult.passed) {
                results.passed = false;
                this.logTestFailure(viewId, test, testResult);
            }
        }

        // Store results
        this.testResults.set(viewId, results);

        // Log summary
        this.logTestSummary(results);

        // Critical failure if tests don't pass
        if (!results.passed) {
            this.criticalFailures.push(viewId);
            this.logger.error(`ACCEPTANCE TEST FAILURE: View '${viewId}' failed critical tests!`, {
                failedTests: results.tests.filter(t => !t.passed)
            });
        }

        return results;
    }

    /**
     * Run a single test
     */
    async runSingleTest(test) {
        try {
            let passed = false;
            let details = '';

            if (test.selector) {
                // DOM-based test
                const elements = document.querySelectorAll(test.selector);
                passed = elements.length > 0;
                details = `Found ${elements.length} element(s)`;
            } else if (test.check) {
                // Function-based test
                passed = await test.check();
                details = passed ? 'Check passed' : 'Check failed';
            } else {
                // Default pass
                passed = true;
                details = 'No specific check defined';
            }

            return {
                passed,
                details,
                executionTime: Date.now()
            };
        } catch (error) {
            return {
                passed: false,
                details: `Test error: ${error.message}`,
                error: error.toString(),
                executionTime: Date.now()
            };
        }
    }

    /**
     * Wait for view to render
     */
    async waitForRender() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                setTimeout(resolve, 100);
            });
        });
    }

    /**
     * Log test failure to wrapper
     */
    logTestFailure(viewId, test, result) {
        this.logger.error(`Acceptance test failed for ${viewId}`, {
            test: test.description,
            testId: test.id,
            details: result.details,
            error: result.error
        });
    }

    /**
     * Log test summary
     */
    logTestSummary(results) {
        const passed = results.tests.filter(t => t.passed).length;
        const total = results.tests.length;

        const level = results.passed ? 'INFO' : 'ERROR';
        const status = results.passed ? 'PASSED' : 'FAILED';

        this.logger.log(level,
            `Acceptance tests ${status} for ${results.viewName}: ${passed}/${total} tests passed`,
            {
                viewId: results.viewId,
                passed: results.passed,
                testsPassed: passed,
                testsTotal: total,
                failedTests: results.tests.filter(t => !t.passed).map(t => t.description)
            }
        );
    }

    /**
     * Run all view tests
     */
    async runAllTests() {
        this.logger.info('Running acceptance tests for all views...');

        const allResults = {
            timestamp: new Date(),
            totalViews: 0,
            passedViews: 0,
            failedViews: [],
            results: []
        };

        for (const viewId of Object.keys(this.viewCriteria)) {
            const result = await this.runViewTests(viewId);
            allResults.results.push(result);
            allResults.totalViews++;

            if (result.passed) {
                allResults.passedViews++;
            } else {
                allResults.failedViews.push(viewId);
            }
        }

        // Log final summary
        const overallPassed = allResults.failedViews.length === 0;
        const level = overallPassed ? 'INFO' : 'ERROR';

        this.logger.log(level,
            `Acceptance test suite ${overallPassed ? 'PASSED' : 'FAILED'}`,
            {
                totalViews: allResults.totalViews,
                passedViews: allResults.passedViews,
                failedViews: allResults.failedViews,
                criticalFailures: this.criticalFailures
            }
        );

        return allResults;
    }

    /**
     * Get test results for a view
     */
    getViewResults(viewId) {
        return this.testResults.get(viewId);
    }

    /**
     * Get all test results
     */
    getAllResults() {
        return Array.from(this.testResults.values());
    }

    /**
     * Check if view has passed tests
     */
    hasViewPassed(viewId) {
        const results = this.testResults.get(viewId);
        return results ? results.passed : null;
    }

    /**
     * Get critical failures
     */
    getCriticalFailures() {
        return this.criticalFailures;
    }

    /**
     * Clear test results
     */
    clearResults() {
        this.testResults.clear();
        this.criticalFailures = [];
    }

    /**
     * Export test results
     */
    exportResults() {
        return {
            timestamp: new Date(),
            results: this.getAllResults(),
            criticalFailures: this.criticalFailures,
            summary: {
                totalTests: this.testResults.size,
                passed: Array.from(this.testResults.values()).filter(r => r.passed).length,
                failed: this.criticalFailures.length
            }
        };
    }
}

// Create global acceptance test instance
window.acceptanceTests = new AcceptanceTests(window.logger);

// Automatically run tests when view loads
if (window.eventBus) {
    window.eventBus.on('view:loaded', async (data) => {
        // Run tests after a short delay to ensure view is fully rendered
        setTimeout(async () => {
            await window.acceptanceTests.runViewTests(data.viewId);
        }, 500);
    });
}

// Log initialization
window.logger.info('Acceptance Test Framework initialized', {
    viewsWithTests: Object.keys(window.acceptanceTests.viewCriteria).length
});