/**
 * Numeric Input Component
 */
class NumericInputComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            value: 0,
            min: null,
            max: null,
            step: 1,
            decimals: 0,
            placeholder: '',
            disabled: false,
            showSpinner: true,
            ...props
        };
    }

    render() {
        const container = this.createElement('div', {
            class: 'numeric-input-component'
        });

        // Create input
        const input = this.createElement('input', {
            type: 'number',
            class: 'numeric-input',
            value: this.formatValue(this.props.value),
            min: this.props.min,
            max: this.props.max,
            step: this.props.step,
            placeholder: this.props.placeholder,
            disabled: this.props.disabled,
            onchange: (e) => this.handleChange(e),
            onkeydown: (e) => this.handleKeyDown(e)
        });

        container.appendChild(input);

        // Add spinner buttons if enabled
        if (this.props.showSpinner && !this.props.disabled) {
            const spinner = this.createElement('div', { class: 'input-spinner' });

            const upButton = this.createElement('button', {
                class: 'spinner-button',
                onclick: () => this.increment()
            }, ['▲']);

            const downButton = this.createElement('button', {
                class: 'spinner-button',
                onclick: () => this.decrement()
            }, ['▼']);

            spinner.appendChild(upButton);
            spinner.appendChild(downButton);
            container.appendChild(spinner);
        }

        this.inputElement = input;
        return container;
    }

    formatValue(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        if (this.props.decimals > 0) {
            return num.toFixed(this.props.decimals);
        }
        return num.toString();
    }

    handleChange(event) {
        const value = this.parseValue(event.target.value);

        if (this.validateValue(value)) {
            this.updateValue(value);
        } else {
            // Reset to previous value
            event.target.value = this.formatValue(this.props.value);
        }
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.increment();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.decrement();
                break;
            case 'Enter':
                event.preventDefault();
                this.commitValue();
                break;
        }
    }

    parseValue(str) {
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    }

    validateValue(value) {
        if (this.props.min !== null && value < this.props.min) {
            return false;
        }
        if (this.props.max !== null && value > this.props.max) {
            return false;
        }
        return true;
    }

    increment() {
        const newValue = this.props.value + this.props.step;
        if (this.validateValue(newValue)) {
            this.updateValue(newValue);
        }
    }

    decrement() {
        const newValue = this.props.value - this.props.step;
        if (this.validateValue(newValue)) {
            this.updateValue(newValue);
        }
    }

    updateValue(value) {
        // Clamp to bounds
        if (this.props.min !== null && value < this.props.min) {
            value = this.props.min;
        }
        if (this.props.max !== null && value > this.props.max) {
            value = this.props.max;
        }

        this.props.value = value;

        // Update input display
        if (this.inputElement) {
            this.inputElement.value = this.formatValue(value);
        }

        // Emit change event
        this.emitEvent('component:change', {
            value: value
        });

        // Write to bound tag if configured
        if (this.props.tagPath && this.tagManager) {
            this.tagManager.writeTag(this.props.tagPath, value);
        }
    }

    commitValue() {
        // Called when Enter is pressed
        this.emitEvent('component:commit', {
            value: this.props.value
        });
    }

    update() {
        if (this.inputElement) {
            this.inputElement.value = this.formatValue(this.props.value);
            this.inputElement.disabled = this.props.disabled;
        }
    }
}