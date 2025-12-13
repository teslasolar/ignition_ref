/**
 * Button Component
 */
class ButtonComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            text: 'Button',
            variant: 'default',
            disabled: false,
            icon: null,
            action: null,
            ...props
        };
    }

    render() {
        const button = this.createElement('button', {
            class: `button-component ${this.props.variant} ${this.props.disabled ? 'disabled' : ''}`,
            disabled: this.props.disabled,
            onclick: (e) => this.handleClick(e)
        });

        // Add icon if present
        if (this.props.icon) {
            const icon = this.createElement('span', { class: 'button-icon' });
            icon.innerHTML = this.props.icon;
            button.appendChild(icon);
        }

        // Add text
        const text = this.createElement('span', { class: 'button-text' }, [this.props.text]);
        button.appendChild(text);

        return button;
    }

    handleClick(event) {
        event.preventDefault();

        if (this.props.disabled) return;

        // Emit click event
        this.emitEvent('component:click', {
            action: this.props.action?.type || 'click',
            value: this.props.action?.value || this.props.value,
            tagPath: this.props.action?.tagPath
        });

        // Execute action
        if (this.props.action) {
            this.executeAction(this.props.action);
        }

        // Execute onClick callback
        if (this.props.onClick && typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    executeAction(action) {
        switch (action.type) {
            case 'navigate':
                this.eventBus.emit('view:change', { viewId: action.value });
                break;

            case 'writeTag':
                if (this.tagManager && action.tagPath) {
                    this.tagManager.writeTag(action.tagPath, action.value);
                }
                break;

            case 'toggleTag':
                if (this.tagManager && action.tagPath) {
                    const currentValue = this.tagManager.readTag(action.tagPath);
                    this.tagManager.writeTag(action.tagPath, !currentValue);
                }
                break;

            case 'script':
                if (action.script) {
                    this.executeScript(action.script);
                }
                break;

            case 'popup':
                this.eventBus.emit('popup:open', action.popup);
                break;

            default:
                console.log('Unknown action type:', action.type);
        }
    }

    executeScript(script) {
        try {
            const func = new Function('component', 'tags', 'eventBus', script);
            func(this, this.tagManager, this.eventBus);
        } catch (error) {
            console.error('Button script error:', error);
        }
    }

    update() {
        if (this.element) {
            // Update button text
            const textElement = this.element.querySelector('.button-text');
            if (textElement) {
                textElement.textContent = this.props.text;
            }

            // Update disabled state
            this.element.disabled = this.props.disabled;
            this.element.classList.toggle('disabled', this.props.disabled);

            // Update variant
            this.element.className = `button-component ${this.props.variant} ${this.props.disabled ? 'disabled' : ''}`;
        }
    }
}