/**
 * Container Component - Basic container for other components
 */
class ContainerComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            type: 'coordinate', // coordinate, flex
            direction: 'row', // for flex containers
            wrap: false,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 0,
            padding: 0,
            backgroundColor: 'transparent',
            border: null,
            ...props
        };
    }

    render() {
        const container = this.createElement('div', {
            class: `container-component ${this.props.type}-container`
        });

        // Apply container styles
        const styles = {
            padding: typeof this.props.padding === 'number' ?
                `${this.props.padding}px` : this.props.padding,
            backgroundColor: this.props.backgroundColor
        };

        if (this.props.type === 'flex') {
            styles.display = 'flex';
            styles.flexDirection = this.props.direction;
            styles.flexWrap = this.props.wrap ? 'wrap' : 'nowrap';
            styles.justifyContent = this.props.justifyContent;
            styles.alignItems = this.props.alignItems;
            styles.gap = typeof this.props.gap === 'number' ?
                `${this.props.gap}px` : this.props.gap;
        } else {
            styles.position = 'relative';
        }

        if (this.props.border) {
            styles.border = this.props.border;
        }

        if (this.props.width) {
            styles.width = typeof this.props.width === 'number' ?
                `${this.props.width}px` : this.props.width;
        }

        if (this.props.height) {
            styles.height = typeof this.props.height === 'number' ?
                `${this.props.height}px` : this.props.height;
        }

        this.setStyle(container, styles);

        // Add content area for children
        const content = this.createElement('div', {
            class: 'component-content',
            style: {
                width: '100%',
                height: '100%',
                position: this.props.type === 'coordinate' ? 'relative' : 'static'
            }
        });

        container.appendChild(content);
        this.contentElement = content;

        return container;
    }

    getChildContainer() {
        return this.contentElement;
    }

    update() {
        if (!this.element) return;

        // Update container styles
        const styles = {
            backgroundColor: this.props.backgroundColor
        };

        if (this.props.type === 'flex') {
            styles.flexDirection = this.props.direction;
            styles.justifyContent = this.props.justifyContent;
            styles.alignItems = this.props.alignItems;
        }

        this.setStyle(this.element, styles);
    }
}