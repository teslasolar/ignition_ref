# Konomi Ignaite Gitway - CLI/API Infrastructure

This directory contains the CLI and API infrastructure for the Konomi Ignaite Gitway system, providing programmatic access to the gateway's functionality.

## Components

### 1. API Server (`api-server.js`)
REST API interface for gateway operations.

#### Endpoints

##### Tag Management
- `GET /api/v1/tags` - List all tags
- `GET /api/v1/tags/:path` - Read specific tag
- `POST /api/v1/tags/:path` - Write tag value
- `DELETE /api/v1/tags/:path` - Delete tag
- `GET /api/v1/tags/:path/history` - Get tag history

##### UDT Management
- `GET /api/v1/udts` - List UDT definitions
- `POST /api/v1/udts` - Create new UDT
- `GET /api/v1/udts/:name` - Get UDT definition
- `POST /api/v1/udts/:name/instances` - Create UDT instance
- `GET /api/v1/udts/instances` - List all instances

##### View Management
- `GET /api/v1/views` - List all views
- `GET /api/v1/views/:id` - Get view definition
- `POST /api/v1/views/:id` - Update view
- `POST /api/v1/views/:id/reload` - Reload view

##### Gateway Operations
- `GET /api/v1/gateway/status` - Gateway status
- `GET /api/v1/gateway/logs` - Get logs
- `POST /api/v1/gateway/logs/clear` - Clear logs
- `GET /api/v1/gateway/metrics` - System metrics

#### Usage Example

```javascript
// Using the API in browser console
const response = await gatewayFetch('/api/v1/tags/Process/Temperature');
const data = await response.json();
console.log('Temperature:', data.value);

// Write a tag value
await gatewayFetch('/api/v1/tags/Process$Temperature', {
    method: 'POST',
    body: JSON.stringify({ value: 75.5 })
});
```

### 2. MCP Server (`mcp-server.js`)
Model Context Protocol server for AI/LLM integration.

#### Available Tools
- `read_tag` - Read tag values
- `write_tag` - Write tag values
- `list_tags` - List available tags
- `navigate_view` - Navigate to views
- `get_logs` - Retrieve system logs

#### Usage Example

```javascript
// Initialize MCP session
const session = await mcpSend('initialize', {
    clientInfo: { name: 'TestClient' }
});

// Read a tag
const tagData = await mcpSend('read_tag', {
    path: 'Process/Temperature'
});

// Subscribe to tag updates
await mcpSend('subscribe_tag', {
    sessionId: session.result.sessionId,
    path: 'Process/Temperature'
});
```

### 3. CLI Interface (`cli-interface.js`)
Command-line style interface for gateway operations.

#### Commands

##### Tag Operations
```bash
tag read <path>                    # Read tag value
tag write <path> <value>           # Write tag value
tag list [pattern]                 # List tags
tag delete <path>                  # Delete tag
tag monitor <path>                 # Monitor tag changes
```

##### UDT Operations
```bash
udt list                           # List UDT definitions
udt create <type> <path> [params]  # Create UDT instance
udt instance                       # List instances
udt export <name>                  # Export UDT definition
```

##### View Operations
```bash
view list                          # List available views
view load <id>                     # Load a view
view reload [id]                   # Reload view
view discover                      # Discover new views
```

##### System Operations
```bash
system status                      # Gateway status
system info                        # System information
system metrics                     # Performance metrics
system config                      # Configuration
```

##### Log Operations
```bash
log show [level] [limit]           # Show logs
log clear                          # Clear logs
log level <level>                  # Set log level
log export [format]                # Export logs
```

#### Usage Example

```javascript
// Using CLI in browser console
await runCommand('tag read Process/Temperature');
await runCommand('tag write Process/Temperature 75.5');
await runCommand('udt create Motor Equipment/Motor1 MotorName=Pump1');
await runCommand('view load overview');
await runCommand('log show ERROR 10');
```

## Integration with Wrapper Log

All API and MCP operations are automatically logged through the wrapper log system:

```javascript
// All operations logged with:
// - Timestamp
// - Action type
// - Parameters
// - Results

window.logger.info('API: Tag written', {
    path: 'Process/Temperature',
    value: 75.5,
    timestamp: new Date()
});
```

## Global Objects

When loaded, these modules create the following global objects:

- `window.gatewayAPI` - API server instance
- `window.gatewayFetch` - Fetch-like API interface
- `window.mcpServer` - MCP server instance
- `window.mcpSend` - MCP message sender
- `window.cli` - CLI interface instance
- `window.runCommand` - CLI command executor

## Loading the CLI/API

To load all CLI/API components in your HTML:

```html
<!-- Load CLI/API Infrastructure -->
<script src="index/cli/api-server.js"></script>
<script src="index/cli/mcp-server.js"></script>
<script src="index/cli/cli-interface.js"></script>
```

## Examples

### Creating Motor Control UDT Instance

```javascript
// Via API
await gatewayFetch('/api/v1/udts/Motor/instances', {
    method: 'POST',
    body: JSON.stringify({
        path: 'Equipment/Pump1',
        parameters: {
            MotorName: 'Main Pump',
            MaxSpeed: 3600
        }
    })
});

// Via CLI
await runCommand('udt create Motor Equipment/Pump1 MotorName="Main Pump" MaxSpeed=3600');

// Via MCP
await mcpSend('create_udt_instance', {
    udtName: 'Motor',
    path: 'Equipment/Pump1',
    parameters: {
        MotorName: 'Main Pump',
        MaxSpeed: 3600
    }
});
```

### Monitoring Tag Changes

```javascript
// Via API (polling)
setInterval(async () => {
    const response = await gatewayFetch('/api/v1/tags/Process$Temperature');
    const data = await response.json();
    console.log('Temperature:', data.value);
}, 1000);

// Via MCP (subscription)
await mcpSend('subscribe_tag', {
    sessionId: sessionId,
    path: 'Process/Temperature'
});

// Via CLI
await runCommand('tag monitor Process/Temperature');
```

## Error Handling

All interfaces include comprehensive error handling:

```javascript
try {
    const response = await gatewayFetch('/api/v1/tags/InvalidPath');
    if (!response.ok) {
        console.error('API Error:', response.status);
    }
} catch (error) {
    console.error('Request failed:', error);
}
```

## Performance Considerations

- Tag updates are batched using requestAnimationFrame
- API responses are cached where appropriate
- MCP subscriptions use efficient event binding
- CLI commands are processed asynchronously

## Security Notes

In production deployments:
1. Enable authentication (`authRequired: true`)
2. Use HTTPS for API endpoints
3. Implement rate limiting
4. Validate all input parameters
5. Sanitize log outputs

## Development Tips

1. Use browser DevTools console for testing
2. Monitor wrapper logs for debugging
3. Use CLI for quick operations
4. Use API for programmatic access
5. Use MCP for AI/LLM integration