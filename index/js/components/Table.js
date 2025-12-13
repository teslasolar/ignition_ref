/**
 * Table Component
 */
class TableComponent extends BaseComponent {
    constructor(id, props, tagManager, eventBus) {
        super(id, props, tagManager, eventBus);

        // Default props
        this.props = {
            data: [],
            columns: [],
            showHeader: true,
            selectable: true,
            selectedRow: null,
            maxHeight: null,
            ...props
        };

        this.selectedIndex = -1;
    }

    render() {
        const container = this.createElement('div', {
            class: 'table-component',
            style: {
                maxHeight: this.props.maxHeight ? `${this.props.maxHeight}px` : 'auto'
            }
        });

        const wrapper = this.createElement('div', { class: 'table-wrapper' });

        // Create table
        const table = this.createElement('table', { class: 'data-table' });

        // Add header
        if (this.props.showHeader && this.props.columns.length > 0) {
            const thead = this.createElement('thead');
            const headerRow = this.createElement('tr');

            this.props.columns.forEach(column => {
                const th = this.createElement('th', {}, [column.header || column.field]);
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        // Add body
        const tbody = this.createElement('tbody');

        this.props.data.forEach((row, rowIndex) => {
            const tr = this.createElement('tr', {
                onclick: () => this.handleRowClick(rowIndex)
            });

            if (rowIndex === this.selectedIndex) {
                tr.classList.add('selected');
            }

            this.props.columns.forEach(column => {
                const value = this.getNestedValue(row, column.field);
                const formattedValue = this.formatCellValue(value, column);

                const td = this.createElement('td');

                if (column.render && typeof column.render === 'function') {
                    const rendered = column.render(value, row, rowIndex);
                    if (typeof rendered === 'string') {
                        td.innerHTML = rendered;
                    } else {
                        td.appendChild(rendered);
                    }
                } else {
                    td.textContent = formattedValue;
                }

                if (column.style) {
                    this.setStyle(td, column.style);
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        container.appendChild(wrapper);

        this.tableElement = table;

        return container;
    }

    getNestedValue(obj, path) {
        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            value = value[key];
            if (value === undefined || value === null) break;
        }

        return value;
    }

    formatCellValue(value, column) {
        if (value === null || value === undefined) return '';

        if (column.format) {
            switch (column.format.type) {
                case 'number':
                    return this.formatNumber(value, column.format);
                case 'date':
                    return this.formatDate(value, column.format);
                case 'boolean':
                    return value ? '✓' : '✗';
                default:
                    return String(value);
            }
        }

        return String(value);
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

        return date.toLocaleString();
    }

    handleRowClick(rowIndex) {
        if (!this.props.selectable) return;

        this.selectedIndex = rowIndex;

        // Update visual selection
        const rows = this.tableElement.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.classList.toggle('selected', index === rowIndex);
        });

        // Emit selection event
        this.emitEvent('table:select', {
            rowIndex: rowIndex,
            data: this.props.data[rowIndex]
        });

        // Execute selection action if defined
        if (this.props.onSelect) {
            this.props.onSelect(this.props.data[rowIndex], rowIndex);
        }
    }

    update() {
        // Re-render the entire table for data updates
        if (this.element) {
            const newElement = this.render();
            this.element.replaceWith(newElement);
            this.element = newElement;
        }
    }
}