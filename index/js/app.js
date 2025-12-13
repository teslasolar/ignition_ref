/**
 * Main Application Controller for Perspective Web Renderer
 */
class PerspectiveApp {
    constructor() {
        this.eventBus = new EventBus();
        this.tagManager = new TagManager(this.eventBus);
        this.componentRegistry = new ComponentRegistry();
        this.viewRenderer = new ViewRenderer(this.componentRegistry, this.tagManager, this.eventBus);
        this.router = new Router(this.viewRenderer, this.eventBus);

        this.currentView = null;
        this.viewCache = new Map();
        this.config = {
            refreshRate: 1000,
            debugMode: false,
            theme: 'dark'
        };

        this.stats = {
            renderTime: 0,
            tagCount: 0,
            updateCount: 0
        };
    }

    async initialize() {
        console.log('Initializing Perspective Web Application...');

        // Register all components
        this.registerComponents();

        // Load available views
        await this.loadViewList();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize router
        this.router.initialize();

        // Start tag update loop
        this.startTagUpdates();

        // Load initial view
        const defaultView = this.getDefaultView();
        if (defaultView) {
            await this.loadView(defaultView);
        }

        // Hide loading overlay
        this.hideLoading();

        console.log('Application initialized successfully');
    }

    registerComponents() {
        // Register all available components
        this.componentRegistry.register('button', ButtonComponent);
        this.componentRegistry.register('label', LabelComponent);
        this.componentRegistry.register('numeric-input', NumericInputComponent);
        this.componentRegistry.register('gauge', GaugeComponent);
        this.componentRegistry.register('chart', ChartComponent);
        this.componentRegistry.register('table', TableComponent);
        this.componentRegistry.register('container', ContainerComponent);
        this.componentRegistry.register('flex-container', FlexContainerComponent);

        console.log(`Registered ${this.componentRegistry.getComponentCount()} components`);
    }

    async loadViewList() {
        try {
            const response = await fetch('index/views/index.json');
            const viewIndex = await response.json();

            this.views = viewIndex.views;
            this.templates = viewIndex.templates;

            // Build navigation
            this.buildNavigation();

            console.log(`Loaded ${this.views.length} views and ${this.templates.length} templates`);
        } catch (error) {
            console.error('Failed to load view index:', error);
            this.views = [];
            this.templates = [];
        }
    }

    buildNavigation() {
        const nav = document.getElementById('view-navigation');
        nav.innerHTML = '';

        this.views.forEach(view => {
            const link = document.createElement('a');
            link.className = 'nav-link';
            link.textContent = view.name;
            link.dataset.viewId = view.id;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadView(view.id);
            });
            nav.appendChild(link);
        });
    }

    async loadView(viewId) {
        console.log(`Loading view: ${viewId}`);
        this.showLoading();

        const startTime = performance.now();

        try {
            // Check cache first
            let viewData;
            if (this.viewCache.has(viewId)) {
                viewData = this.viewCache.get(viewId);
            } else {
                // Load view JSON
                const response = await fetch(`index/views/${viewId}.json`);
                viewData = await response.json();
                this.viewCache.set(viewId, viewData);
            }

            // Clear current view
            this.clearView();

            // Render new view
            const viewContainer = document.getElementById('view-content');
            await this.viewRenderer.render(viewData, viewContainer);

            // Update current view
            this.currentView = viewData;

            // Update navigation active state
            this.updateNavigationState(viewId);

            // Update footer info
            this.updateFooterInfo(viewData);

            // Calculate render time
            const renderTime = performance.now() - startTime;
            this.stats.renderTime = renderTime.toFixed(2);

            // Emit view loaded event
            this.eventBus.emit('view:loaded', { viewId, renderTime });

            console.log(`View loaded in ${renderTime.toFixed(2)}ms`);
        } catch (error) {
            console.error('Failed to load view:', error);
            this.showError('Failed to load view: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    clearView() {
        const viewContainer = document.getElementById('view-content');
        viewContainer.innerHTML = '';
        this.tagManager.clearTags();
    }

    updateNavigationState(activeViewId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.viewId === activeViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateFooterInfo(viewData) {
        document.getElementById('current-view').textContent = `View: ${viewData.name || 'Unknown'}`;
        document.getElementById('refresh-rate').textContent = `Update: ${this.config.refreshRate}ms`;
        document.getElementById('render-time').textContent = `Render: ${this.stats.renderTime}ms`;
        document.getElementById('tag-count').textContent = `Tags: ${this.tagManager.getTagCount()}`;
    }

    setupEventListeners() {
        // Listen for tag updates
        this.eventBus.on('tag:update', (data) => {
            this.stats.updateCount++;
            this.updateFooterInfo(this.currentView);
        });

        // Listen for component events
        this.eventBus.on('component:click', (data) => {
            console.log('Component clicked:', data);
            this.handleComponentAction(data);
        });

        // Listen for view change requests
        this.eventBus.on('view:change', (data) => {
            this.loadView(data.viewId);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.eventBus.emit('window:resize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDebugMode();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshView();
            }
        });
    }

    startTagUpdates() {
        // Simulate tag updates
        setInterval(() => {
            this.tagManager.updateSimulatedTags();
        }, this.config.refreshRate);
    }

    handleComponentAction(data) {
        const { componentId, action, value } = data;

        switch (action) {
            case 'navigate':
                this.loadView(value);
                break;
            case 'write-tag':
                this.tagManager.writeTag(data.tagPath, value);
                break;
            case 'open-popup':
                this.openPopup(value);
                break;
            case 'run-script':
                this.runScript(value);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    openPopup(config) {
        const modal = document.getElementById('property-modal');
        const modalContent = document.querySelector('#property-editor');

        modalContent.innerHTML = `
            <h3>${config.title || 'Popup'}</h3>
            <div>${config.content || ''}</div>
        `;

        modal.classList.add('active');

        // Close button handler
        document.querySelector('.close').onclick = () => {
            modal.classList.remove('active');
        };
    }

    runScript(script) {
        try {
            // Create safe script context
            const context = {
                tags: this.tagManager,
                view: this.currentView,
                app: this,
                console: console
            };

            // Execute script in context
            const func = new Function('context', script);
            func(context);
        } catch (error) {
            console.error('Script execution error:', error);
        }
    }

    toggleDebugMode() {
        this.config.debugMode = !this.config.debugMode;
        document.body.classList.toggle('debug-mode', this.config.debugMode);
        console.log('Debug mode:', this.config.debugMode);
    }

    refreshView() {
        if (this.currentView) {
            this.loadView(this.currentView.id);
        }
    }

    getDefaultView() {
        if (this.views && this.views.length > 0) {
            // Check URL hash for view
            const hash = window.location.hash.slice(1);
            if (hash) {
                const view = this.views.find(v => v.id === hash);
                if (view) return view.id;
            }

            // Return first view as default
            return this.views[0].id;
        }
        return null;
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    showError(message) {
        const viewContent = document.getElementById('view-content');
        viewContent.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h2 class="error">Error</h2>
                <p>${message}</p>
                <button class="button-component" onclick="window.perspectiveApp.refreshView()">
                    Retry
                </button>
            </div>
        `;
    }
}