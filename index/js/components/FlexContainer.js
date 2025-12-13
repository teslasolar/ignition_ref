/**
 * FlexContainer Component - Advanced flex layout container
 */
class FlexContainerComponent extends ContainerComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Override with flex-specific defaults
        this.props = {
            type: 'flex',
            direction: 'row',
            wrap: false,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            alignContent: 'stretch',
            gap: 10,
            padding: 10,
            ...props
        };
    }

    render() {
        const container = super.render();
        container.classList.add('flex-container');
        return container;
    }
}