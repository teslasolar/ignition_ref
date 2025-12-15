/**
 * DockingManager - Manages North, East, West, South dock areas and center body
 * Similar to Ignition Perspective's docked view system
 */
class DockingManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.dockTemplates = null;
        this.activeDocks = new Map();
        this.dockStates = new Map(); // Store collapsed/expanded state
        this.resizeHandlers = new Map();
        this.currentTemplate = null;

        // Default dock sizes
        this.defaultSizes = {
            north: '60px',
            south: '40px',
            east: '300px',
            west: '250px'
        };

        // Minimum sizes for docks
        this.minSizes = {
            north: 40,
            south: 30,
            east: 200,
            west: 200
        };
    }

    async initialize() {
        window.logger.info('Initializing DockingManager...');

        try {
            // Load dock templates
            await this.loadTemplates();

            // Create dock container structure
            this.createDockStructure();

            // Setup event listeners
            this.setupEventListeners();

            window.logger.info('DockingManager initialized successfully');
        } catch (error) {
            window.logger.error('Failed to initialize DockingManager:', error);
            throw error;
        }
    }

    async loadTemplates() {
        try {
            const response = await fetch('index/templates/dock-templates.json');
            if (!response.ok) {
                throw new Error(`Failed to load dock templates: ${response.statusText}`);
            }
            this.dockTemplates = await response.json();
            window.logger.info(`Loaded ${Object.keys(this.dockTemplates.templates).length} dock templates`);
        } catch (error) {
            window.logger.error('Failed to load dock templates:', error);
            // Use default template if loading fails
            this.dockTemplates = this.getDefaultTemplates();
        }
    }

    getDefaultTemplates() {
        return {
            templates: {
                default: {
                    name: "Default Layout",
                    description: "Standard layout with all docks",
                    docks: {
                        north: { enabled: true, size: "60px", collapsible: true },
                        south: { enabled: true, size: "40px", collapsible: true },
                        east: { enabled: true, size: "300px", collapsible: true },
                        west: { enabled: true, size: "250px", collapsible: true }
                    }
                }
            }
        };
    }

    createDockStructure() {
        const viewContent = document.getElementById('view-content');
        if (!viewContent) {
            throw new Error('View content container not found');
        }

        // Clear existing content
        viewContent.innerHTML = '';

        // Create main dock container
        const dockContainer = document.createElement('div');
        dockContainer.id = 'dock-container';
        dockContainer.className = 'dock-container';

        // Create dock regions
        const regions = ['north', 'west', 'center', 'east', 'south'];
        regions.forEach(region => {
            const dock = document.createElement('div');
            dock.id = `dock-${region}`;
            dock.className = `dock-region dock-${region}`;
            dock.dataset.region = region;

            if (region !== 'center') {
                // Add header with collapse button
                const header = document.createElement('div');
                header.className = 'dock-header';

                const title = document.createElement('span');
                title.className = 'dock-title';
                title.textContent = this.capitalize(region);

                const collapseBtn = document.createElement('button');
                collapseBtn.className = 'dock-collapse-btn';
                collapseBtn.innerHTML = '◀';
                collapseBtn.title = 'Collapse';
                collapseBtn.addEventListener('click', () => this.toggleDock(region));

                header.appendChild(title);
                header.appendChild(collapseBtn);
                dock.appendChild(header);

                // Add resize handle
                if (region === 'west' || region === 'east') {
                    const handle = document.createElement('div');
                    handle.className = `resize-handle resize-handle-${region}`;
                    dock.appendChild(handle);
                    this.setupResizeHandle(handle, region);
                }

                if (region === 'north' || region === 'south') {
                    const handle = document.createElement('div');
                    handle.className = `resize-handle resize-handle-${region}`;
                    dock.appendChild(handle);
                    this.setupResizeHandle(handle, region);
                }
            }

            // Add content area
            const content = document.createElement('div');
            content.className = 'dock-content';
            content.id = `dock-${region}-content`;
            dock.appendChild(content);

            dockContainer.appendChild(dock);
        });

        viewContent.appendChild(dockContainer);
    }

    setupResizeHandle(handle, region) {
        let isResizing = false;
        let startPos = 0;
        let startSize = 0;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startPos = (region === 'west' || region === 'east') ? e.clientX : e.clientY;

            const dock = document.getElementById(`dock-${region}`);
            startSize = (region === 'west' || region === 'east')
                ? dock.offsetWidth
                : dock.offsetHeight;

            e.preventDefault();
            document.body.style.cursor = (region === 'west' || region === 'east')
                ? 'col-resize'
                : 'row-resize';
        });

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const dock = document.getElementById(`dock-${region}`);
            let newSize;

            if (region === 'west') {
                newSize = startSize + (e.clientX - startPos);
            } else if (region === 'east') {
                newSize = startSize - (e.clientX - startPos);
            } else if (region === 'north') {
                newSize = startSize + (e.clientY - startPos);
            } else if (region === 'south') {
                newSize = startSize - (e.clientY - startPos);
            }

            // Apply minimum size constraint
            newSize = Math.max(newSize, this.minSizes[region]);

            // Apply new size
            if (region === 'west' || region === 'east') {
                dock.style.width = `${newSize}px`;
            } else {
                dock.style.height = `${newSize}px`;
            }

            // Update grid template
            this.updateGridTemplate();

            // Emit resize event
            this.eventBus.emit('dock:resize', { region, size: newSize });
        };

        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';

                // Save dock size to state
                const dock = document.getElementById(`dock-${region}`);
                const size = (region === 'west' || region === 'east')
                    ? dock.style.width
                    : dock.style.height;

                if (!this.dockStates.has(region)) {
                    this.dockStates.set(region, {});
                }
                this.dockStates.get(region).size = size;
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Store handlers for cleanup
        this.resizeHandlers.set(region, { onMouseMove, onMouseUp });
    }

    toggleDock(region) {
        const dock = document.getElementById(`dock-${region}`);
        if (!dock) return;

        const isCollapsed = dock.classList.contains('collapsed');

        if (isCollapsed) {
            this.expandDock(region);
        } else {
            this.collapseDock(region);
        }
    }

    collapseDock(region) {
        const dock = document.getElementById(`dock-${region}`);
        if (!dock) return;

        // Save current size before collapsing
        if (!this.dockStates.has(region)) {
            this.dockStates.set(region, {});
        }

        const state = this.dockStates.get(region);
        if (region === 'west' || region === 'east') {
            state.size = dock.style.width || this.defaultSizes[region];
        } else {
            state.size = dock.style.height || this.defaultSizes[region];
        }
        state.collapsed = true;

        dock.classList.add('collapsed');

        // Update collapse button
        const btn = dock.querySelector('.dock-collapse-btn');
        if (btn) {
            btn.innerHTML = this.getCollapseIcon(region, true);
            btn.title = 'Expand';
        }

        this.updateGridTemplate();
        this.eventBus.emit('dock:collapsed', { region });
    }

    expandDock(region) {
        const dock = document.getElementById(`dock-${region}`);
        if (!dock) return;

        dock.classList.remove('collapsed');

        // Restore previous size
        const state = this.dockStates.get(region);
        if (state && state.size) {
            if (region === 'west' || region === 'east') {
                dock.style.width = state.size;
            } else {
                dock.style.height = state.size;
            }
        }

        if (state) {
            state.collapsed = false;
        }

        // Update collapse button
        const btn = dock.querySelector('.dock-collapse-btn');
        if (btn) {
            btn.innerHTML = this.getCollapseIcon(region, false);
            btn.title = 'Collapse';
        }

        this.updateGridTemplate();
        this.eventBus.emit('dock:expanded', { region });
    }

    getCollapseIcon(region, collapsed) {
        if (collapsed) {
            switch (region) {
                case 'north': return '▼';
                case 'south': return '▲';
                case 'east': return '◀';
                case 'west': return '▶';
            }
        } else {
            switch (region) {
                case 'north': return '▲';
                case 'south': return '▼';
                case 'east': return '▶';
                case 'west': return '◀';
            }
        }
        return '◀';
    }

    updateGridTemplate() {
        const container = document.getElementById('dock-container');
        if (!container) return;

        const north = document.getElementById('dock-north');
        const south = document.getElementById('dock-south');
        const east = document.getElementById('dock-east');
        const west = document.getElementById('dock-west');

        // Calculate grid template based on collapsed state
        const northHeight = north.classList.contains('collapsed') ? 'auto' : (north.style.height || this.defaultSizes.north);
        const southHeight = south.classList.contains('collapsed') ? 'auto' : (south.style.height || this.defaultSizes.south);
        const eastWidth = east.classList.contains('collapsed') ? 'auto' : (east.style.width || this.defaultSizes.east);
        const westWidth = west.classList.contains('collapsed') ? 'auto' : (west.style.width || this.defaultSizes.west);

        container.style.gridTemplateRows = `${northHeight} 1fr ${southHeight}`;
        container.style.gridTemplateColumns = `${westWidth} 1fr ${eastWidth}`;
    }

    applyTemplate(templateName, viewConfig = {}) {
        window.logger.info(`Applying dock template: ${templateName}`);

        if (!this.dockTemplates || !this.dockTemplates.templates[templateName]) {
            window.logger.warn(`Template ${templateName} not found, using default`);
            templateName = 'default';
        }

        const template = this.dockTemplates.templates[templateName];
        this.currentTemplate = templateName;

        // Apply template to each dock
        Object.entries(template.docks).forEach(([region, config]) => {
            const dock = document.getElementById(`dock-${region}`);
            if (!dock) return;

            if (config.enabled) {
                dock.classList.remove('hidden');

                // Set initial size
                if (config.size) {
                    if (region === 'west' || region === 'east') {
                        dock.style.width = config.size;
                    } else {
                        dock.style.height = config.size;
                    }
                }

                // Set collapsible state
                if (!config.collapsible) {
                    const btn = dock.querySelector('.dock-collapse-btn');
                    if (btn) btn.style.display = 'none';
                }

                // Apply custom classes
                if (config.className) {
                    dock.classList.add(config.className);
                }

                // Set initial collapsed state
                if (config.collapsed) {
                    this.collapseDock(region);
                }
            } else {
                dock.classList.add('hidden');
            }
        });

        this.updateGridTemplate();
        this.eventBus.emit('dock:template-applied', { templateName, template });
    }

    renderDockContent(region, content, renderer) {
        const dockContent = document.getElementById(`dock-${region}-content`);
        if (!dockContent) {
            window.logger.error(`Dock content area not found for region: ${region}`);
            return;
        }

        // Clear existing content
        dockContent.innerHTML = '';

        if (!content) return;

        // Render content using ViewRenderer
        if (renderer && content.component) {
            renderer.renderComponent(content.component, dockContent);
        } else if (content.html) {
            dockContent.innerHTML = content.html;
        } else if (content.text) {
            const textNode = document.createElement('div');
            textNode.className = 'dock-text-content';
            textNode.textContent = content.text;
            dockContent.appendChild(textNode);
        }

        this.activeDocks.set(region, content);
        this.eventBus.emit('dock:content-rendered', { region, content });
    }

    clearDock(region) {
        const dockContent = document.getElementById(`dock-${region}-content`);
        if (dockContent) {
            dockContent.innerHTML = '';
        }
        this.activeDocks.delete(region);
    }

    clearAllDocks() {
        ['north', 'south', 'east', 'west'].forEach(region => {
            this.clearDock(region);
        });
    }

    getDockState(region) {
        return this.dockStates.get(region) || {};
    }

    setDockState(region, state) {
        this.dockStates.set(region, { ...this.getDockState(region), ...state });
    }

    getCenterContent() {
        return document.getElementById('dock-center-content');
    }

    setupEventListeners() {
        // Listen for view changes to clear docks if needed
        this.eventBus.on('view:loaded', (data) => {
            // Docks persist across views unless explicitly cleared
            window.logger.debug('View loaded, maintaining dock state');
        });

        // Keyboard shortcuts for dock management
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                switch (e.key) {
                    case 'N':
                        e.preventDefault();
                        this.toggleDock('north');
                        break;
                    case 'S':
                        e.preventDefault();
                        this.toggleDock('south');
                        break;
                    case 'E':
                        e.preventDefault();
                        this.toggleDock('east');
                        break;
                    case 'W':
                        e.preventDefault();
                        this.toggleDock('west');
                        break;
                }
            }
        });
    }

    getAvailableTemplates() {
        if (!this.dockTemplates) return [];
        return Object.keys(this.dockTemplates.templates).map(key => ({
            id: key,
            name: this.dockTemplates.templates[key].name,
            description: this.dockTemplates.templates[key].description
        }));
    }

    getCurrentTemplate() {
        return this.currentTemplate;
    }

    isDockCollapsed(region) {
        const state = this.dockStates.get(region);
        return state ? state.collapsed : false;
    }

    setDockSize(region, size) {
        const dock = document.getElementById(`dock-${region}`);
        if (!dock) return;

        if (region === 'west' || region === 'east') {
            dock.style.width = typeof size === 'number' ? `${size}px` : size;
        } else {
            dock.style.height = typeof size === 'number' ? `${size}px` : size;
        }

        this.updateGridTemplate();
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    destroy() {
        // Clean up event listeners
        this.resizeHandlers.forEach((handlers, region) => {
            document.removeEventListener('mousemove', handlers.onMouseMove);
            document.removeEventListener('mouseup', handlers.onMouseUp);
        });

        this.resizeHandlers.clear();
        this.activeDocks.clear();
        this.dockStates.clear();

        window.logger.info('DockingManager destroyed');
    }
}
