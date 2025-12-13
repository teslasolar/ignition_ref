/**
 * Chart Component - Simple chart visualization
 */
class ChartComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            type: 'line', // line, bar
            data: [],
            labels: [],
            title: '',
            xLabel: '',
            yLabel: '',
            width: 400,
            height: 300,
            color: '#1e88e5',
            gridLines: true,
            ...props
        };

        this.canvas = null;
        this.ctx = null;
    }

    render() {
        const container = this.createElement('div', {
            class: 'chart-component',
            style: {
                width: `${this.props.width}px`,
                height: `${this.props.height}px`
            }
        });

        // Add title
        if (this.props.title) {
            const title = this.createElement('h3', {
                style: { textAlign: 'center', marginBottom: '10px' }
            }, [this.props.title]);
            container.appendChild(title);
        }

        // Create canvas
        const canvas = this.createElement('canvas', {
            class: 'chart-canvas',
            width: this.props.width - 40,
            height: this.props.height - 60
        });

        container.appendChild(canvas);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Draw chart
        requestAnimationFrame(() => {
            this.drawChart();
        });

        return container;
    }

    drawChart() {
        if (!this.ctx || !this.props.data || this.props.data.length === 0) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate scales
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        const maxValue = Math.max(...this.props.data);
        const minValue = Math.min(...this.props.data);
        const range = maxValue - minValue || 1;

        // Draw grid lines
        if (this.props.gridLines) {
            this.drawGridLines(ctx, padding, chartWidth, chartHeight);
        }

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw data
        if (this.props.type === 'line') {
            this.drawLineChart(ctx, padding, chartWidth, chartHeight, minValue, range);
        } else if (this.props.type === 'bar') {
            this.drawBarChart(ctx, padding, chartWidth, chartHeight, minValue, range);
        }

        // Draw labels
        this.drawLabels(ctx, padding, chartWidth, chartHeight, minValue, maxValue);
    }

    drawGridLines(ctx, padding, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height * i) / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
        }

        // Vertical grid lines
        const dataPoints = this.props.data.length;
        for (let i = 0; i <= dataPoints; i++) {
            const x = padding + (width * i) / dataPoints;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + height);
            ctx.stroke();
        }
    }

    drawAxes(ctx, padding, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + height);
        ctx.stroke();

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + height);
        ctx.lineTo(padding + width, padding + height);
        ctx.stroke();
    }

    drawLineChart(ctx, padding, width, height, minValue, range) {
        const dataPoints = this.props.data.length;
        const xStep = width / (dataPoints - 1 || 1);

        ctx.strokeStyle = this.props.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        this.props.data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = padding + height - ((value - minValue) / range) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = this.props.color;
        this.props.data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = padding + height - ((value - minValue) / range) * height;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawBarChart(ctx, padding, width, height, minValue, range) {
        const dataPoints = this.props.data.length;
        const barWidth = width / dataPoints * 0.8;
        const barSpacing = width / dataPoints * 0.2;

        ctx.fillStyle = this.props.color;

        this.props.data.forEach((value, index) => {
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const barHeight = ((value - minValue) / range) * height;
            const y = padding + height - barHeight;

            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    drawLabels(ctx, padding, width, height, minValue, maxValue) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';

        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (maxValue - minValue) * (1 - i / 5);
            const y = padding + (height * i) / 5;
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(1), padding - 5, y + 3);
        }

        // X-axis labels
        if (this.props.labels && this.props.labels.length > 0) {
            const labelStep = Math.ceil(this.props.labels.length / 10);
            ctx.textAlign = 'center';

            this.props.labels.forEach((label, index) => {
                if (index % labelStep === 0) {
                    const x = padding + (width * index) / (this.props.labels.length - 1 || 1);
                    ctx.fillText(label, x, padding + height + 15);
                }
            });
        }
    }

    update() {
        if (this.canvas && this.ctx) {
            this.drawChart();
        }
    }

    onDestroyed() {
        this.canvas = null;
        this.ctx = null;
    }
}