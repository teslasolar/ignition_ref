/**
 * Gauge Component
 */
class GaugeComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            value: 0,
            min: 0,
            max: 100,
            label: '',
            units: '',
            showValue: true,
            showLabel: true,
            color: null,
            thresholds: [],
            size: 200,
            ...props
        };
    }

    render() {
        const container = this.createElement('div', {
            class: 'gauge-component',
            style: {
                width: `${this.props.size}px`,
                height: `${this.props.size}px`
            }
        });

        // Create SVG gauge
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'gauge-svg');
        svg.setAttribute('viewBox', '0 0 200 200');

        // Background arc
        const bgArc = this.createArc(100, 100, 80, 0, 270, 'gauge-background');
        svg.appendChild(bgArc);

        // Progress arc
        const progress = this.calculateProgress();
        const progressArc = this.createArc(100, 100, 80, 0, progress * 270, 'gauge-progress');
        progressArc.style.stroke = this.getColor();
        svg.appendChild(progressArc);

        container.appendChild(svg);

        // Add value display
        if (this.props.showValue) {
            const valueDisplay = this.createElement('div', {
                class: 'gauge-value'
            }, [`${this.props.value.toFixed(1)}${this.props.units}`]);
            container.appendChild(valueDisplay);
        }

        // Add label
        if (this.props.showLabel && this.props.label) {
            const label = this.createElement('div', {
                class: 'gauge-label'
            }, [this.props.label]);
            container.appendChild(label);
        }

        this.svgElement = svg;
        this.progressElement = progressArc;

        return container;
    }

    createArc(cx, cy, radius, startAngle, endAngle, className) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', className);

        const start = this.polarToCartesian(cx, cy, radius, startAngle - 135);
        const end = this.polarToCartesian(cx, cy, radius, endAngle - 135);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        const d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(' ');

        path.setAttribute('d', d);
        return path;
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    }

    calculateProgress() {
        const range = this.props.max - this.props.min;
        const normalizedValue = Math.max(0, Math.min(1,
            (this.props.value - this.props.min) / range
        ));
        return normalizedValue;
    }

    getColor() {
        // Check thresholds
        if (this.props.thresholds && this.props.thresholds.length > 0) {
            for (const threshold of this.props.thresholds) {
                if (this.props.value >= threshold.value) {
                    return threshold.color;
                }
            }
        }

        // Use specified color or default
        return this.props.color || '#1e88e5';
    }

    update() {
        if (!this.element) return;

        // Update progress arc
        if (this.progressElement) {
            const progress = this.calculateProgress();
            const newArc = this.createArc(100, 100, 80, 0, progress * 270, 'gauge-progress');
            newArc.style.stroke = this.getColor();
            this.progressElement.replaceWith(newArc);
            this.progressElement = newArc;
        }

        // Update value display
        const valueDisplay = this.element.querySelector('.gauge-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${this.props.value.toFixed(1)}${this.props.units}`;
        }

        // Update label
        const label = this.element.querySelector('.gauge-label');
        if (label && this.props.label) {
            label.textContent = this.props.label;
        }
    }
}