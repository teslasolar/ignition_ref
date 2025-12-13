/**
 * Label Component
 */
class LabelComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            text: '',
            variant: 'default',
            format: null,
            prefix: '',
            suffix: '',
            ...props
        };
    }

    render() {
        const label = this.createElement('span', {
            class: `label-component ${this.props.variant}`
        });

        const text = this.formatText(this.props.text);
        label.textContent = `${this.props.prefix}${text}${this.props.suffix}`;

        if (this.props.style) {
            this.setStyle(label, this.props.style);
        }

        return label;
    }

    formatText(value) {
        if (!this.props.format) return value;

        switch (this.props.format.type) {
            case 'number':
                return this.formatNumber(value, this.props.format);
            case 'date':
                return this.formatDate(value, this.props.format);
            case 'boolean':
                return this.formatBoolean(value, this.props.format);
            case 'currency':
                return this.formatCurrency(value, this.props.format);
            default:
                return value;
        }
    }

    formatNumber(value, format) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;

        const decimals = format.decimals !== undefined ? format.decimals : 2;
        return num.toFixed(decimals);
    }

    formatDate(value, format) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;

        const pattern = format.pattern || 'MM/DD/YYYY HH:mm:ss';
        return this.formatDatePattern(date, pattern);
    }

    formatDatePattern(date, pattern) {
        const replacements = {
            'YYYY': date.getFullYear(),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'DD': String(date.getDate()).padStart(2, '0'),
            'HH': String(date.getHours()).padStart(2, '0'),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'ss': String(date.getSeconds()).padStart(2, '0')
        };

        let result = pattern;
        Object.entries(replacements).forEach(([key, value]) => {
            result = result.replace(key, value);
        });

        return result;
    }

    formatBoolean(value, format) {
        const bool = Boolean(value);
        return bool ? (format.trueText || 'True') : (format.falseText || 'False');
    }

    formatCurrency(value, format) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;

        const currency = format.currency || 'USD';
        const locale = format.locale || 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(num);
    }

    update() {
        if (this.element) {
            const text = this.formatText(this.props.text);
            this.element.textContent = `${this.props.prefix}${text}${this.props.suffix}`;

            if (this.props.style) {
                this.setStyle(this.element, this.props.style);
            }
        }
    }
}