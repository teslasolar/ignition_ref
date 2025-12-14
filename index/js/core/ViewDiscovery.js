/**
 * ViewDiscovery - Auto-discovers and loads views from the views directory
 */
class ViewDiscovery {
    constructor(eventBus, logger) {
        this.eventBus = eventBus;
        this.logger = logger || window.logger;
        this.views = new Map();
        this.templates = new Map();
        this.viewManifest = null;
        this.autoDiscoveryInterval = null;
        this.lastCheck = null;
    }

    async initialize() {
        this.logger.info('Initializing View Discovery System');

        // Try to load manifest first
        await this.loadManifest();

        // Start auto-discovery
        this.startAutoDiscovery();

        return this.getAllViews();
    }

    async loadManifest() {
        try {
            const response = await fetch('index/views/manifest.json');
            if (response.ok) {
                this.viewManifest = await response.json();
                this.logger.info('View manifest loaded', this.viewManifest);

                // Process manifest entries
                if (this.viewManifest.views) {
                    for (const viewConfig of this.viewManifest.views) {
                        await this.registerView(viewConfig);
                    }
                }

                if (this.viewManifest.templates) {
                    for (const templateConfig of this.viewManifest.templates) {
                        await this.registerTemplate(templateConfig);
                    }
                }
            }
        } catch (error) {
            this.logger.warn('No manifest found, using auto-discovery', error);
        }
    }

    async startAutoDiscovery() {
        // Initial discovery
        await this.discoverViews();

        // Set up periodic checks (every 5 seconds in dev mode)
        if (this.isDevMode()) {
            this.autoDiscoveryInterval = setInterval(() => {
                this.discoverViews();
            }, 5000);
        }
    }

    async discoverViews() {
        try {
            // Try to fetch views index
            const response = await fetch('index/views/index.json');
            if (response.ok) {
                const index = await response.json();

                // Check for new views
                const newViews = [];

                if (index.views) {
                    for (const viewConfig of index.views) {
                        if (!this.views.has(viewConfig.id)) {
                            await this.registerView(viewConfig);
                            newViews.push(viewConfig);
                        }
                    }
                }

                if (index.templates) {
                    for (const templateConfig of index.templates) {
                        if (!this.templates.has(templateConfig.id)) {
                            await this.registerTemplate(templateConfig);
                        }
                    }
                }

                if (newViews.length > 0) {
                    this.notifyNewViews(newViews);
                }

                this.lastCheck = new Date();
            } else {
                // Fallback: Try to discover by scanning known patterns
                await this.scanForViews();
            }
        } catch (error) {
            this.logger.error('Error discovering views', error);
        }
    }

    async scanForViews() {
        // Try common view names
        const commonViewNames = [
            'overview', 'process', 'equipment', 'alarms', 'trends',
            'gateway', 'configuration', 'diagnostics', 'logs', 'tags',
            'users', 'security', 'reports', 'analytics', 'maintenance'
        ];

        for (const name of commonViewNames) {
            if (!this.views.has(name)) {
                try {
                    const response = await fetch(`index/views/${name}.json`);
                    if (response.ok) {
                        const viewData = await response.json();
                        await this.registerViewFromData(name, viewData);
                    }
                } catch (error) {
                    // View doesn't exist, continue
                }
            }
        }
    }

    async registerView(config) {
        try {
            // Load view data
            const response = await fetch(`index/views/${config.id}.json`);
            if (response.ok) {
                const viewData = await response.json();

                this.views.set(config.id, {
                    id: config.id,
                    name: config.name || viewData.name || config.id,
                    description: config.description || viewData.description || '',
                    icon: config.icon || viewData.icon || '📄',
                    category: config.category || viewData.category || 'General',
                    path: `index/views/${config.id}.json`,
                    data: viewData,
                    loadTime: new Date()
                });

                this.logger.debug(`View registered: ${config.id}`);
                this.eventBus.emit('view:registered', { id: config.id });

                return true;
            }
        } catch (error) {
            this.logger.error(`Failed to register view: ${config.id}`, error);
        }

        return false;
    }

    async registerViewFromData(id, viewData) {
        this.views.set(id, {
            id: id,
            name: viewData.name || id,
            description: viewData.description || '',
            icon: viewData.icon || '📄',
            category: viewData.category || 'General',
            path: `index/views/${id}.json`,
            data: viewData,
            loadTime: new Date()
        });

        this.logger.info(`Auto-discovered view: ${id}`);
        this.eventBus.emit('view:discovered', { id: id });
    }

    async registerTemplate(config) {
        try {
            const response = await fetch(`index/templates/${config.id}.json`);
            if (response.ok) {
                const templateData = await response.json();

                this.templates.set(config.id, {
                    id: config.id,
                    name: config.name || templateData.name || config.id,
                    description: config.description || templateData.description || '',
                    category: config.category || 'Templates',
                    path: `index/templates/${config.id}.json`,
                    data: templateData,
                    loadTime: new Date()
                });

                this.logger.debug(`Template registered: ${config.id}`);
                this.eventBus.emit('template:registered', { id: config.id });

                return true;
            }
        } catch (error) {
            this.logger.error(`Failed to register template: ${config.id}`, error);
        }

        return false;
    }

    getAllViews() {
        return Array.from(this.views.values());
    }

    getView(id) {
        return this.views.get(id);
    }

    getViewsByCategory(category) {
        return Array.from(this.views.values()).filter(view => view.category === category);
    }

    getAllTemplates() {
        return Array.from(this.templates.values());
    }

    getTemplate(id) {
        return this.templates.get(id);
    }

    getCategories() {
        const categories = new Set();
        this.views.forEach(view => {
            categories.add(view.category);
        });
        return Array.from(categories);
    }

    notifyNewViews(newViews) {
        this.logger.info(`Discovered ${newViews.length} new views`);

        // Show notification
        const notification = document.createElement('div');
        notification.className = 'view-discovery active';
        notification.innerHTML = `
            <div class="view-discovery-title">New Views Discovered</div>
            <div class="view-discovery-list">
                ${newViews.map(v => `
                    <div class="view-discovery-item new">${v.name || v.id}</div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

        this.eventBus.emit('views:discovered', { views: newViews });
    }

    isDevMode() {
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    }

    stopAutoDiscovery() {
        if (this.autoDiscoveryInterval) {
            clearInterval(this.autoDiscoveryInterval);
            this.autoDiscoveryInterval = null;
        }
    }

    async reloadView(id) {
        const view = this.views.get(id);
        if (view) {
            try {
                const response = await fetch(view.path + '?t=' + Date.now());
                if (response.ok) {
                    const viewData = await response.json();
                    view.data = viewData;
                    view.loadTime = new Date();
                    this.logger.info(`View reloaded: ${id}`);
                    this.eventBus.emit('view:reloaded', { id: id });
                    return true;
                }
            } catch (error) {
                this.logger.error(`Failed to reload view: ${id}`, error);
            }
        }
        return false;
    }

    getStats() {
        return {
            viewCount: this.views.size,
            templateCount: this.templates.size,
            categories: this.getCategories().length,
            lastCheck: this.lastCheck,
            autoDiscovery: this.autoDiscoveryInterval !== null
        };
    }
}