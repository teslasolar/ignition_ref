/**
 * ComponentRegistry - Manages available components
 */
class ComponentRegistry {
    constructor() {
        this.components = new Map();
        this.instances = new Map();
        this.nextInstanceId = 1;
    }

    register(type, componentClass) {
        if (this.components.has(type)) {
            console.warn(`Component type '${type}' is already registered`);
        }
        this.components.set(type, componentClass);
    }

    unregister(type) {
        this.components.delete(type);
    }

    create(type, props = {}, tagManager = null, eventBus = null) {
        if (!this.components.has(type)) {
            console.error(`Unknown component type: ${type}`);
            return null;
        }

        const ComponentClass = this.components.get(type);
        const instanceId = `${type}-${this.nextInstanceId++}`;

        const instance = new ComponentClass(instanceId, props, tagManager, eventBus);
        this.instances.set(instanceId, instance);

        return instance;
    }

    getInstance(instanceId) {
        return this.instances.get(instanceId);
    }

    destroyInstance(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
        this.instances.delete(instanceId);
    }

    clearInstances() {
        this.instances.forEach((instance) => {
            if (typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
        this.instances.clear();
    }

    getComponentCount() {
        return this.components.size;
    }

    getInstanceCount() {
        return this.instances.size;
    }

    getRegisteredTypes() {
        return Array.from(this.components.keys());
    }

    hasComponent(type) {
        return this.components.has(type);
    }
}

/**
 * Base Component Class
 */
class BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        this.id = id;
        this.props = props || {};
        this.tagManager = tagManager;
        this.eventBus = eventBus;
        this.element = null;
        this.bindings = [];
        this.eventListeners = [];
    }

    render() {
        // To be implemented by subclasses
        throw new Error('render() must be implemented by component subclass');
    }

    mount(container) {
        this.element = this.render();
        if (this.element) {
            container.appendChild(this.element);
            this.setupBindings();
            this.onMounted();
        }
    }

    setupBindings() {
        // Setup tag bindings
        if (this.props.bindings) {
            Object.entries(this.props.bindings).forEach(([prop, tagPath]) => {
                if (this.tagManager) {
                    const unbind = this.tagManager.bindTag(tagPath, (value) => {
                        this.updateProp(prop, value);
                    });
                    this.bindings.push(unbind);

                    // Set initial value
                    const initialValue = this.tagManager.readTag(tagPath);
                    if (initialValue !== null) {
                        this.updateProp(prop, initialValue);
                    }
                }
            });
        }
    }

    updateProp(prop, value) {
        this.props[prop] = value;
        this.update();
    }

    update() {
        if (this.element) {
            const newElement = this.render();
            if (newElement) {
                this.element.replaceWith(newElement);
                this.element = newElement;
            }
        }
    }

    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }

    destroy() {
        // Remove tag bindings
        this.bindings.forEach(unbind => unbind());
        this.bindings = [];

        // Remove event listeners
        this.removeEventListeners();

        // Remove element
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        this.onDestroyed();
    }

    onMounted() {
        // Hook for subclasses
    }

    onDestroyed() {
        // Hook for subclasses
    }

    emitEvent(event, data = {}) {
        if (this.eventBus) {
            this.eventBus.emit(event, {
                componentId: this.id,
                ...data
            });
        }
    }

    setStyle(element, styles) {
        if (styles) {
            Object.assign(element.style, styles);
        }
    }

    addClass(element, ...classes) {
        element.classList.add(...classes);
    }

    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                this.setStyle(element, value);
            } else if (key === 'class') {
                element.className = value;
            } else if (key.startsWith('on')) {
                const event = key.slice(2).toLowerCase();
                this.addEventListener(element, event, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                element.appendChild(child);
            }
        });

        return element;
    }
}