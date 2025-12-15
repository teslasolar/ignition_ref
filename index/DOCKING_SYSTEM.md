# Docking System Documentation

## Overview

The Konomi Ignaite Gitway application now includes a comprehensive docking template system that provides North, East, West, and South dock areas for each view, similar to professional SCADA systems like Ignition Perspective.

## Architecture

### Core Components

1. **DockingManager.js** (`index/js/core/DockingManager.js`)
   - Manages all dock regions (North, East, West, South, Center)
   - Handles dock collapsing/expanding
   - Manages dock resizing with drag handles
   - Applies dock templates
   - Provides event-based communication

2. **docking.css** (`index/css/docking.css`)
   - CSS Grid-based layout for dock regions
   - Responsive styles for all screen sizes
   - Collapse/expand animations
   - Resize handle styles
   - Utility classes for dock content

3. **dock-templates.json** (`index/templates/dock-templates.json`)
   - Pre-defined dock configurations
   - 8 built-in templates (default, process, dashboard, diagnostic, editor, fullscreen, split, minimal)
   - Customizable dock sizes and behaviors

4. **ViewRenderer.js** (Updated)
   - Extended to support docked view rendering
   - Renders components in dock regions
   - Maintains backward compatibility with non-docked views

5. **app.js** (Updated)
   - Initializes DockingManager on startup
   - Wires up dock event listeners
   - Integrates docking with existing application flow

## Dock Regions

### North Dock
- **Location**: Top of the view
- **Typical Use**: View titles, controls, toolbars
- **Default Size**: 60px
- **Grid Area**: `north`

### South Dock
- **Location**: Bottom of the view
- **Typical Use**: Status bars, footers, summary information
- **Default Size**: 40px
- **Grid Area**: `south`

### West Dock
- **Location**: Left side of the view
- **Typical Use**: Navigation trees, tool palettes
- **Default Size**: 250px
- **Grid Area**: `west`

### East Dock
- **Location**: Right side of the view
- **Typical Use**: Properties panels, details, diagnostics
- **Default Size**: 300px
- **Grid Area**: `east`

### Center
- **Location**: Middle of the view
- **Typical Use**: Main content area
- **Grid Area**: `center`

## Dock Templates

### Available Templates

1. **default** - Standard layout with all docks enabled
2. **process** - Optimized for process monitoring with tool palette
3. **dashboard** - Minimal layout with only north and south docks
4. **diagnostic** - Layout with large east properties panel
5. **editor** - Full featured layout for editing
6. **fullscreen** - No docks, only center content
7. **split** - Split view with 50/50 west and east panels
8. **minimal** - All docks present but side panels collapsed

### Template Structure

```json
{
  "templates": {
    "template-name": {
      "name": "Display Name",
      "description": "Template description",
      "docks": {
        "north": {
          "enabled": true,
          "size": "60px",
          "collapsible": true,
          "collapsed": false,
          "className": "optional-class"
        },
        // ... other docks
      }
    }
  }
}
```

## View JSON Structure

### Docked View Format

```json
{
  "id": "view-id",
  "name": "View Name",
  "metadata": {
    "title": "View Title",
    "backgroundColor": "#1e1e1e",
    "padding": "0px"
  },
  "docking": {
    "template": "default",
    "north": {
      "component": {
        "type": "container",
        "props": { ... },
        "children": [ ... ]
      }
    },
    "south": {
      "component": { ... }
    },
    "east": {
      "component": { ... }
    },
    "west": {
      "component": { ... }
    },
    "center": {
      "component": { ... }
    }
  }
}
```

### Non-Docked View Format (Legacy)

```json
{
  "id": "view-id",
  "name": "View Name",
  "metadata": { ... },
  "root": {
    "type": "container",
    "props": { ... },
    "children": [ ... ]
  }
}
```

## Features

### 1. Collapsible Docks

- Click the collapse button in the dock header
- Keyboard shortcuts:
  - `Ctrl+Shift+N` - Toggle North dock
  - `Ctrl+Shift+S` - Toggle South dock
  - `Ctrl+Shift+E` - Toggle East dock
  - `Ctrl+Shift+W` - Toggle West dock

### 2. Resizable Docks

- Drag the resize handle between docks
- Minimum sizes enforced:
  - North/South: 40px/30px
  - East/West: 200px

### 3. Responsive Design

- On screens < 768px, east and west docks are hidden
- North and south docks remain visible
- Center content expands to fill available space

### 4. Nested Docking

- Docks can contain other dock containers
- Allows for complex hierarchical layouts

### 5. Event System

The DockingManager emits the following events:

- `dock:collapsed` - When a dock is collapsed
- `dock:expanded` - When a dock is expanded
- `dock:resize` - When a dock is resized
- `dock:template-applied` - When a template is applied
- `dock:content-rendered` - When content is rendered in a dock

## API Reference

### DockingManager Methods

```javascript
// Initialize the docking manager
await dockingManager.initialize()

// Apply a dock template
dockingManager.applyTemplate(templateName)

// Render content in a dock region
dockingManager.renderDockContent(region, content, renderer)

// Toggle dock collapse state
dockingManager.toggleDock(region)

// Collapse a dock
dockingManager.collapseDock(region)

// Expand a dock
dockingManager.expandDock(region)

// Clear dock content
dockingManager.clearDock(region)

// Clear all docks
dockingManager.clearAllDocks()

// Get center content container
const centerElement = dockingManager.getCenterContent()

// Get dock state
const state = dockingManager.getDockState(region)

// Set dock state
dockingManager.setDockState(region, { size: '300px', collapsed: false })

// Set dock size
dockingManager.setDockSize(region, '300px')

// Check if dock is collapsed
const isCollapsed = dockingManager.isDockCollapsed(region)

// Get available templates
const templates = dockingManager.getAvailableTemplates()

// Get current template
const current = dockingManager.getCurrentTemplate()
```

## CSS Classes

### Dock Container Classes

- `.dock-container` - Main dock container
- `.dock-region` - Individual dock region
- `.dock-north`, `.dock-south`, `.dock-east`, `.dock-west`, `.dock-center` - Specific regions
- `.dock-header` - Dock header with title and controls
- `.dock-content` - Dock content area
- `.dock-collapse-btn` - Collapse/expand button

### State Classes

- `.collapsed` - Applied when dock is collapsed
- `.hidden` - Applied when dock is hidden
- `.dragging` - Applied during drag operations
- `.drag-over` - Applied during drag-over operations
- `.loading` - Applied when content is loading

### Utility Classes

- `.dock-nav-tree` - Navigation tree styling
- `.dock-property-group` - Property group container
- `.dock-property-row` - Property row layout
- `.dock-property-label` - Property label styling
- `.dock-property-value` - Property value styling
- `.dock-toolbar` - Toolbar container
- `.dock-status-bar` - Status bar container
- `.dock-divider` - Visual divider
- `.dock-section` - Section container

## Examples

### Example 1: Basic Docked View

```json
{
  "id": "my-view",
  "name": "My View",
  "docking": {
    "template": "default",
    "north": {
      "component": {
        "type": "label",
        "props": {
          "text": "My View Title",
          "variant": "heading"
        }
      }
    },
    "center": {
      "component": {
        "type": "container",
        "props": { "padding": "20px" },
        "children": [
          // Main content here
        ]
      }
    }
  }
}
```

### Example 2: Navigation Tree in West Dock

```json
{
  "west": {
    "component": {
      "type": "container",
      "props": {
        "className": "dock-nav-tree"
      },
      "children": [
        {
          "type": "button",
          "props": {
            "text": "Item 1",
            "action": {
              "type": "navigate",
              "value": "view1"
            }
          }
        },
        {
          "type": "button",
          "props": {
            "text": "Item 2",
            "action": {
              "type": "navigate",
              "value": "view2"
            }
          }
        }
      ]
    }
  }
}
```

### Example 3: Properties Panel in East Dock

```json
{
  "east": {
    "component": {
      "type": "container",
      "props": {
        "type": "flex",
        "direction": "column",
        "gap": 15
      },
      "children": [
        {
          "type": "container",
          "props": {
            "className": "dock-property-group"
          },
          "children": [
            {
              "type": "label",
              "props": {
                "text": "Properties",
                "className": "dock-property-group-title"
              }
            },
            {
              "type": "container",
              "props": {
                "className": "dock-property-row"
              },
              "children": [
                {
                  "type": "label",
                  "props": {
                    "text": "Name:",
                    "className": "dock-property-label"
                  }
                },
                {
                  "type": "label",
                  "props": {
                    "bindings": {
                      "text": "Path/To/Tag"
                    },
                    "className": "dock-property-value"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

## Migration Guide

### Converting Existing Views to Docked Layout

1. Change `"root"` to `"docking.center.component"`
2. Add `"docking.template"` with desired template name
3. Add dock regions as needed (north, south, east, west)
4. Set metadata padding to "0px" (docks handle their own padding)

### Before:
```json
{
  "id": "view",
  "metadata": {
    "padding": "20px"
  },
  "root": {
    "type": "container",
    "children": [ ... ]
  }
}
```

### After:
```json
{
  "id": "view",
  "metadata": {
    "padding": "0px"
  },
  "docking": {
    "template": "default",
    "north": { ... },
    "center": {
      "component": {
        "type": "container",
        "props": { "padding": "20px" },
        "children": [ ... ]
      }
    }
  }
}
```

## Best Practices

1. **Use appropriate templates** - Choose templates that match your use case
2. **Consistent dock content** - Keep similar content in the same dock across views
3. **Responsive design** - Test views at different screen sizes
4. **Performance** - Avoid rendering heavy content in collapsed docks
5. **User experience** - Provide clear labels and intuitive navigation
6. **Accessibility** - Use semantic HTML and ARIA labels
7. **State persistence** - Dock states are maintained across view changes

## Troubleshooting

### Docks not appearing
- Check that DockingManager is initialized before loading views
- Verify dock-templates.json is accessible
- Check browser console for errors

### Content not rendering in docks
- Ensure component types are registered
- Verify JSON structure matches expected format
- Check that ViewRenderer has reference to DockingManager

### Resize handles not working
- Verify docking.css is loaded
- Check for JavaScript errors
- Ensure dock is not marked as non-collapsible

### Template not applying
- Check template name matches entry in dock-templates.json
- Verify template JSON is valid
- Check browser console for warnings

## Future Enhancements

Potential future improvements:

1. Drag-and-drop dock rearrangement
2. Floating/detachable docks
3. Tab support within docks
4. Dock state persistence to localStorage
5. Custom dock templates via UI
6. Dock content animations
7. Multi-monitor support
8. Dock presets per user role

## Support

For issues or questions about the docking system:

1. Check this documentation
2. Review example views (overview.json)
3. Inspect browser console for errors
4. Check DockingManager event logs
5. Review CSS for styling issues

## Credits

The docking system was inspired by:
- Ignition Perspective's docked view system
- Modern IDE layouts (VS Code, IntelliJ)
- Professional SCADA systems
