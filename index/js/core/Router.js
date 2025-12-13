/**
 * Router - Handles view navigation and URL management
 */
class Router {
    constructor(viewRenderer, eventBus) {
        this.viewRenderer = viewRenderer;
        this.eventBus = eventBus;
        this.currentView = null;
        this.history = [];
        this.routes = new Map();
    }

    initialize() {
        // Setup browser history handling
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.viewId) {
                this.eventBus.emit('view:change', { viewId: event.state.viewId });
            }
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const viewId = window.location.hash.slice(1);
            if (viewId) {
                this.eventBus.emit('view:change', { viewId });
            }
        });
    }

    navigate(viewId, params = {}) {
        // Update URL
        const url = `#${viewId}`;
        window.history.pushState({ viewId, params }, '', url);

        // Store in history
        this.history.push({
            viewId,
            params,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
        }

        // Update current view
        this.currentView = viewId;

        // Emit navigation event
        this.eventBus.emit('router:navigate', { viewId, params });
    }

    back() {
        if (window.history.length > 1) {
            window.history.back();
        }
    }

    forward() {
        window.history.forward();
    }

    registerRoute(path, viewId) {
        this.routes.set(path, viewId);
    }

    getRouteForPath(path) {
        return this.routes.get(path);
    }

    getCurrentView() {
        return this.currentView;
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
    }
}