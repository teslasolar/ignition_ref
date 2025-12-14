# Konomi Ignaite Gitway

## Overview

Konomi Ignaite Gitway is a web-based HMI (Human Machine Interface) application that provides Ignition Perspective-style functionality through JSON-driven views, tag management, and gateway operations. It runs entirely in the browser using GitHub Pages for hosting.

## Features Implemented

### 1. Core Infrastructure
- **Auto-Loading View Discovery**: Automatically discovers and loads views from the views folder
- **UDT (User Defined Types) System**: Template-based tag management with reusable structures
- **Comprehensive Logging**: Gateway-style wrapper log system with persistence
- **Event-Driven Architecture**: Central event bus for component communication
- **Tag Management**: Real-time tag system with bindings and simulated data

### 2. CLI/API Infrastructure

#### REST API Server
- Complete REST API for tag, view, and gateway operations
- Endpoints for CRUD operations on tags, UDTs, and views
- System metrics and diagnostics endpoints
- Browser-based implementation using fetch-like interface

#### MCP Server Wrapper
- Model Context Protocol compatibility for AI/LLM integration
- Tool definitions for tag operations, view navigation, and logging
- Session management and subscription support
- Integrated with wrapper log system

#### CLI Interface
- Command-line style interface for all gateway operations
- Commands for tag management, UDT operations, view control
- System diagnostics and log management
- Interactive monitoring capabilities

### 3. Views Created

1. **System Overview** - Main dashboard with gauges and system status
2. **Process Control** - Process monitoring and control interface
3. **Equipment Status** - Equipment monitoring and control panel
4. **Alarms** - Alarm management and acknowledgment
5. **Trends** - Historical data trending
6. **Gateway Management** - Complete gateway configuration interface
7. **System Diagnostics** - Real-time performance monitoring
8. **Tag Browser** - Browse and manage system tags

### 4. UDT Definitions

Pre-configured UDT templates:
- **Motor**: Complete motor control with status, speed, current, temperature
- **Valve**: Valve control with position and status
- **Tank**: Tank monitoring with level, volume, and alarms
- **PID Loop**: PID control loop with tuning parameters

## Architecture

```
index.html                    # Main application
index/
├── css/
│   ├── perspective.css      # Main styles
│   ├── components.css       # Component styles
│   └── gateway.css          # Konomi branding
├── js/
│   ├── core/
│   │   ├── Logger.js        # Wrapper log system
│   │   ├── EventBus.js      # Event management
│   │   ├── TagManager.js    # Tag management
│   │   ├── UDTManager.js    # UDT system
│   │   ├── ViewDiscovery.js # Auto-discovery
│   │   ├── ComponentRegistry.js
│   │   ├── ViewRenderer.js
│   │   └── Router.js
│   └── components/          # UI components
├── cli/
│   ├── api-server.js        # REST API
│   ├── mcp-server.js        # MCP interface
│   └── cli-interface.js     # CLI commands
└── views/                   # JSON view definitions
```

## Usage

### Browser Console Commands

#### Tag Operations
```javascript
// Read a tag
await runCommand('tag read Process/Temperature');

// Write a tag
await runCommand('tag write Process/Temperature 75.5');

// Monitor tag changes
await runCommand('tag monitor Process/Temperature');
```

#### UDT Operations
```javascript
// Create motor instance
window.udtManager.createInstance('Motor', 'Equipment/Pump1', {
    MotorName: 'Main Pump',
    MaxSpeed: 3600
});

// List UDT definitions
await runCommand('udt list');
```

#### API Access
```javascript
// Fetch tag data
const response = await gatewayFetch('/api/v1/tags/Process/Temperature');
const data = await response.json();

// Write tag value
await gatewayFetch('/api/v1/tags/Process$Temperature', {
    method: 'POST',
    body: JSON.stringify({ value: 75.5 })
});
```

#### MCP Integration
```javascript
// Initialize MCP session
const session = await mcpSend('initialize', {
    clientInfo: { name: 'TestClient' }
});

// Read tag via MCP
const tagData = await mcpSend('read_tag', {
    path: 'Process/Temperature'
});
```

### View Navigation

Views are automatically discovered and loaded. Navigate between views using:
- The top navigation bar
- CLI: `await runCommand('view load overview')`
- API: `window.router.navigate('overview')`

### Gateway Management

Access gateway management through:
- Gateway button in header
- Navigate to gateway view
- CLI: `await runCommand('system status')`

## Key Features

### Auto-Discovery System
- Automatically finds and loads views from the views directory
- Hot-reload support in development mode
- Manifest-based or pattern-based discovery
- Real-time notifications for new views

### UDT System Benefits
- Reusable tag structures
- Parameter-based customization
- Nested folder organization
- Expression support for calculated tags
- Reduces tag management overhead

### Logging System
- Persisted logs in localStorage
- Multiple log levels (ERROR, WARN, INFO, DEBUG, TRACE)
- Export capabilities (JSON, CSV, text)
- Performance timing helpers
- Global error handling

### API/CLI Integration
- Unified interface across API, CLI, and MCP
- All operations logged to wrapper log
- Session management for subscriptions
- Real-time tag monitoring
- Batch operations support

## Deployment

The application is designed to run on GitHub Pages:

1. All files are static (HTML, CSS, JavaScript)
2. No server-side code required
3. Uses localStorage for persistence
4. JSON files for configuration

Access the live application at:
```
https://[username].github.io/ignition_ref/
```

## Development

### Adding New Views
1. Create JSON file in `index/views/`
2. Add entry to `index/views/index.json`
3. View will be auto-discovered

### Creating UDT Instances
```javascript
window.udtManager.createInstance('Motor', 'Equipment/NewMotor', {
    MotorName: 'Feed Motor',
    MaxSpeed: 1800
});
```

### Custom Components
1. Create component class in `index/js/components/`
2. Register in ComponentRegistry
3. Add styles to `components.css`

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Optimizations

- Tag updates batched using requestAnimationFrame
- Views cached after first load
- Components only re-render on bound tag changes
- Lazy loading for views
- Efficient event binding system

## Security Notes

- No authentication required (demo mode)
- All data stored locally in browser
- No external API calls
- Safe for public GitHub Pages hosting

## Future Enhancements

Potential additions:
- WebSocket support for real-time data
- User authentication system
- Database persistence option
- Advanced scripting capabilities
- Mobile responsive design
- Dark/light theme toggle
- Export/import configurations
- Multi-language support

## Credits

Konomi Ignaite Gitway - A modern web-based HMI inspired by Ignition Perspective
Built as part of the Ignition Reference Documentation project