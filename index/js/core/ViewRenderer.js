/**
 * ViewRenderer - Renders views from JSON definitions
 */
class ViewRenderer {
    constructor(componentRegistry, tagManager, eventBus, dockingManager = null) {
        this.componentRegistry = componentRegistry;
        this.tagManager = tagManager;
        this.eventBus = eventBus;
        this.dockingManager = dockingManager;
        this.renderCache = new Map();
    }

    setDockingManager(dockingManager) {
        this.dockingManager = dockingManager;
    }

    async render(viewData, container) {
        // Clear existing instances
        this.componentRegistry.clearInstances();

        // Set view metadata
        if (viewData.metadata) {
            this.applyMetadata(viewData.metadata, container);
        }

        // Load view styles if present
        if (viewData.styles) {
            this.applyStyles(viewData.styles);
        }

        // Initialize view parameters
        if (viewData.params) {
            this.initializeParams(viewData.params);
        }

        // Check if view uses docking layout
        if (viewData.docking && this.dockingManager) {
            // Create dock structure if not exists
            this.dockingManager.createDockStructure();
            await this.renderDockedView(viewData, container);
        } else {
            // Clear any existing dock structure for non-docked views
            const dockContainer = document.getElementById('dock-container');
            if (dockContainer) {
                dockContainer.remove();
            }

            // Render traditional non-docked view
            if (viewData.root) {
                await this.renderComponent(viewData.root, container);
            }
        }

        // Setup view scripts
        if (viewData.scripts) {
            this.setupScripts(viewData.scripts);
        }

        return container;
    }

    async renderDockedView(viewData, container) {
        const { docking } = viewData;

        // Apply dock template if specified
        if (docking.template) {
            this.dockingManager.applyTemplate(docking.template);
        }

        // Render content for each dock region
        if (docking.north) {
            await this.dockingManager.renderDockContent('north', docking.north, this);
        }

        if (docking.south) {
            await this.dockingManager.renderDockContent('south', docking.south, this);
        }

        if (docking.east) {
            await this.dockingManager.renderDockContent('east', docking.east, this);
        }

        if (docking.west) {
            await this.dockingManager.renderDockContent('west', docking.west, this);
        }

        // Render center content (main view area)
        if (docking.center || viewData.root) {
            const centerContent = this.dockingManager.getCenterContent();
            if (centerContent) {
                const content = docking.center || viewData.root;
                if (content.component) {
                    await this.renderComponent(content.component, centerContent);
                } else {
                    // Legacy support: render root directly
                    await this.renderComponent(content, centerContent);
                }
            }
        }
    }

    async renderComponent(componentData, container) {
        const { type, props = {}, children = [], style = {} } = componentData;

        // Handle template references
        if (type === 'template') {
            return this.renderTemplate(props.templateId, props.params || {}, container);
        }

        // Create component instance
        const component = this.componentRegistry.create(
            type,
            props,
            this.tagManager,
            this.eventBus
        );

        if (!component) {
            console.error(`Failed to create component of type: ${type}`);
            return null;
        }

        // Create component element
        const element = component.render();
        if (!element) return null;

        // Apply inline styles
        if (style && Object.keys(style).length > 0) {
            Object.assign(element.style, style);
        }

        // Apply positioning for coordinate containers
        if (props.position) {
            element.style.position = 'absolute';
            if (props.position.x !== undefined) element.style.left = `${props.position.x}px`;
            if (props.position.y !== undefined) element.style.top = `${props.position.y}px`;
            if (props.position.width !== undefined) element.style.width = `${props.position.width}px`;
            if (props.position.height !== undefined) element.style.height = `${props.position.height}px`;
        }

        // Add to container
        container.appendChild(element);

        // Setup component bindings
        component.setupBindings();

        // Render children
        if (children.length > 0) {
            const childContainer = this.getChildContainer(component, element);
            for (const childData of children) {
                await this.renderComponent(childData, childContainer);
            }
        }

        // Call mounted hook
        if (typeof component.onMounted === 'function') {
            component.onMounted();
        }

        return element;
    }

    getChildContainer(component, element) {
        // Some components have specific child containers
        if (component.getChildContainer) {
            return component.getChildContainer();
        }

        // Look for content area
        const contentArea = element.querySelector('.component-content');
        if (contentArea) return contentArea;

        // Default to the element itself
        return element;
    }

    async renderTemplate(templateId, params, container) {
        try {
            // Load template if not cached
            let templateData;
            if (this.renderCache.has(templateId)) {
                templateData = this.renderCache.get(templateId);
            } else {
                const response = await fetch(`index/templates/${templateId}.json`);
                templateData = await response.json();
                this.renderCache.set(templateId, templateData);
            }

            // Apply parameters to template
            const processedTemplate = this.processTemplate(templateData, params);

            // Render processed template
            return this.render(processedTemplate, container);
        } catch (error) {
            console.error(`Failed to render template ${templateId}:`, error);
            return null;
        }
    }

    processTemplate(template, params) {
        // Deep clone template
        const processed = JSON.parse(JSON.stringify(template));

        // Replace parameter placeholders
        const processObject = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = this.replaceParams(obj[key], params);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    processObject(obj[key]);
                }
            }
        };

        processObject(processed);
        return processed;
    }

    replaceParams(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    }

    applyMetadata(metadata, container) {
        // Apply view-level metadata
        if (metadata.title) {
            document.title = metadata.title;
        }

        if (metadata.backgroundColor) {
            container.style.backgroundColor = metadata.backgroundColor;
        }

        if (metadata.padding) {
            container.style.padding = metadata.padding;
        }

        if (metadata.className) {
            container.className = metadata.className;
        }
    }

    applyStyles(styles) {
        // Create or update style element
        let styleEl = document.getElementById('view-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'view-styles';
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = styles;
    }

    initializeParams(params) {
        // Create view parameters as tags
        Object.entries(params).forEach(([key, config]) => {
            const tagPath = `View/Params/${key}`;
            this.tagManager.createTag(
                tagPath,
                config.defaultValue,
                config.type,
                config.metadata
            );
        });
    }

    setupScripts(scripts) {
        // Execute view initialization scripts
        scripts.forEach(script => {
            try {
                if (script.type === 'startup') {
                    this.executeScript(script.code);
                } else if (script.type === 'timer') {
                    setInterval(() => {
                        this.executeScript(script.code);
                    }, script.interval || 1000);
                }
            } catch (error) {
                console.error('Script execution error:', error);
            }
        });
    }

    executeScript(code) {
        const context = {
            tags: this.tagManager,
            components: this.componentRegistry,
            eventBus: this.eventBus,
            view: this
        };

        try {
            const func = new Function('context', code);
            func(context);
        } catch (error) {
            console.error('Script execution failed:', error);
        }
    }

    clearCache() {
        this.renderCache.clear();
    }
}