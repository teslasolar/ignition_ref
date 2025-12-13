# Ignition Perspective Web Renderer

A JSON-driven web HMI application that mimics Ignition Perspective's component and view rendering system.

## Features

- **JSON-Driven Views**: Define entire HMI screens using JSON configuration
- **Component Library**: Button, Label, NumericInput, Gauge, Chart, Table, Containers
- **Tag System**: Simulated tag management with bindings and real-time updates
- **Templates**: Reusable component templates with parameterization
- **Event System**: Central event bus for component communication
- **Router**: Navigation between different views

## Quick Start

1. Open `index.html` in a modern web browser
2. The application will automatically load and display the Overview dashboard
3. Navigate between views using the top navigation bar

## Architecture

```
index.html                 # Main application entry point
index/
├── css/                   # Stylesheets
│   ├── perspective.css    # Main application styles
│   └── components.css     # Component-specific styles
├── js/
│   ├── app.js            # Main application controller
│   ├── core/             # Core framework modules
│   │   ├── EventBus.js   # Event management
│   │   ├── TagManager.js # Tag data management
│   │   ├── ComponentRegistry.js
│   │   ├── ViewRenderer.js
│   │   └── Router.js
│   └── components/       # Component implementations
│       ├── Button.js
│       ├── Label.js
│       ├── NumericInput.js
│       ├── Gauge.js
│       ├── Chart.js
│       ├── Table.js
│       └── Container.js
├── views/                # View definitions
│   ├── index.json        # View index
│   ├── overview.json     # Overview dashboard
│   ├── process.json      # Process control
│   ├── equipment.json    # Equipment status
│   ├── alarms.json       # Alarm management
│   └── trends.json       # Historical trends
└── templates/            # Reusable templates
    └── motor-control.json
```

## Creating Views

Views are defined in JSON format. Example structure:

```json
{
  "id": "my-view",
  "name": "My View",
  "metadata": {
    "title": "Page Title",
    "backgroundColor": "#1e1e1e"
  },
  "root": {
    "type": "container",
    "props": {
      "type": "flex",
      "direction": "column"
    },
    "children": [
      {
        "type": "label",
        "props": {
          "text": "Hello World",
          "variant": "heading"
        }
      }
    ]
  }
}
```

## Component Types

### Display Components
- **label**: Text display with formatting
- **gauge**: Circular gauge visualization
- **chart**: Line/bar charts
- **table**: Data table with columns

### Input Components
- **button**: Action buttons
- **numeric-input**: Number input with validation

### Layout Components
- **container**: Flex or coordinate container
- **flex-container**: Specialized flex layout

## Tag Bindings

Components can bind to tags for dynamic updates:

```json
{
  "type": "label",
  "props": {
    "bindings": {
      "text": "Process/Temperature"
    },
    "suffix": " °F",
    "format": {
      "type": "number",
      "decimals": 1
    }
  }
}
```

## Actions

Buttons can trigger various actions:

```json
{
  "type": "button",
  "props": {
    "text": "Start",
    "action": {
      "type": "writeTag",
      "tagPath": "Equipment/Pump1/Status",
      "value": true
    }
  }
}
```

Action types:
- `navigate`: Change view
- `writeTag`: Write tag value
- `toggleTag`: Toggle boolean tag
- `script`: Execute JavaScript
- `popup`: Open popup window

## Templates

Create reusable component groups with parameters:

```json
{
  "type": "template",
  "props": {
    "templateId": "motor-control",
    "params": {
      "motorName": "Pump 1",
      "tagBasePath": "Equipment/Pump1"
    }
  }
}
```

## Development

### Adding New Components

1. Create component class in `index/js/components/`
2. Register in `app.js` `registerComponents()` method
3. Add styles to `index/css/components.css`

### Adding New Views

1. Create JSON file in `index/views/`
2. Add to `index/views/index.json`

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Views are cached after first load
- Tag updates are batched using requestAnimationFrame
- Components only re-render when their bound tags change

## License

Part of the Ignition Reference Documentation project. MIT License.