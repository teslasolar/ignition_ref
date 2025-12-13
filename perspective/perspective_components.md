# Perspective Component Library

## Component Parameters

```params
module: Perspective
component_count: 50+
binding_types: tag,property,expression,query,transform
event_model: unified
responsive: true
```

## Perspective Component Overview

Perspective provides a comprehensive library of modern, responsive components designed for industrial applications across desktop, mobile, and tablet devices.

## Component Categories

```python
#!/usr/bin/env python
def get_perspective_components():
    """Get all Perspective component categories and types"""

    components = {
        "Basic Components": {
            "Button": {
                "description": "Clickable button with actions",
                "key_props": ["text", "enabled", "primary", "icon"],
                "events": ["onClick", "onActionPerformed"]
            },
            "Label": {
                "description": "Display text or values",
                "key_props": ["text", "textStyle", "alignHorizontal"],
                "events": []
            },
            "Numeric Entry Field": {
                "description": "Number input with validation",
                "key_props": ["value", "min", "max", "format"],
                "events": ["onChange", "onFocus", "onBlur"]
            },
            "Text Field": {
                "description": "Single-line text input",
                "key_props": ["text", "placeholder", "enabled"],
                "events": ["onChange", "onEnter"]
            },
            "Text Area": {
                "description": "Multi-line text input",
                "key_props": ["text", "rows", "resizable"],
                "events": ["onChange"]
            },
            "Dropdown": {
                "description": "Select from list of options",
                "key_props": ["value", "options", "placeholder"],
                "events": ["onChange"]
            },
            "Radio Group": {
                "description": "Single selection from options",
                "key_props": ["value", "options", "orientation"],
                "events": ["onChange"]
            },
            "Checkbox": {
                "description": "Boolean toggle input",
                "key_props": ["selected", "label", "enabled"],
                "events": ["onChange"]
            },
            "Toggle Switch": {
                "description": "On/off switch control",
                "key_props": ["selected", "label", "color"],
                "events": ["onChange"]
            }
        },
        "Display Components": {
            "LED Display": {
                "description": "Seven-segment LED display",
                "key_props": ["value", "segments", "color"],
                "events": []
            },
            "Progress": {
                "description": "Linear or circular progress indicator",
                "key_props": ["value", "max", "determinate", "circular"],
                "events": []
            },
            "Gauge": {
                "description": "Radial gauge with needle",
                "key_props": ["value", "min", "max", "units", "ranges"],
                "events": []
            },
            "Linear Scale": {
                "description": "Horizontal/vertical scale indicator",
                "key_props": ["value", "min", "max", "orientation"],
                "events": []
            },
            "Thermometer": {
                "description": "Temperature display",
                "key_props": ["value", "min", "max", "units"],
                "events": []
            },
            "Tank": {
                "description": "Tank level indicator",
                "key_props": ["value", "capacity", "units", "showValue"],
                "events": []
            },
            "Cylindrical Tank": {
                "description": "3D cylindrical tank display",
                "key_props": ["value", "capacity", "liquidColor"],
                "events": []
            },
            "Symbol": {
                "description": "Industrial symbol library",
                "key_props": ["path", "color", "animation"],
                "events": ["onClick"]
            }
        },
        "Container Components": {
            "View": {
                "description": "Embedded view container",
                "key_props": ["path", "params", "useDefaultViewWidth"],
                "events": ["onStartup", "onShutdown"]
            },
            "Flex Container": {
                "description": "Flexible layout container",
                "key_props": ["direction", "justify", "alignItems", "wrap"],
                "events": []
            },
            "Coordinate Container": {
                "description": "Absolute positioning container",
                "key_props": ["mode", "aspectRatio"],
                "events": []
            },
            "Column Container": {
                "description": "Responsive column layout",
                "key_props": ["columns", "gutters", "breakpoints"],
                "events": []
            },
            "Tab Container": {
                "description": "Tabbed content container",
                "key_props": ["tabs", "selectedTab", "tabStyle"],
                "events": ["onTabChange"]
            },
            "Carousel": {
                "description": "Slideshow container",
                "key_props": ["views", "activePane", "autoPlay"],
                "events": ["onPaneChange"]
            },
            "Accordion": {
                "description": "Collapsible content sections",
                "key_props": ["panes", "expandedPanes", "multiExpand"],
                "events": ["onExpandChange"]
            },
            "Split Container": {
                "description": "Resizable split panes",
                "key_props": ["orientation", "splitPercentage"],
                "events": ["onSplitChange"]
            }
        },
        "Input Components": {
            "Slider": {
                "description": "Value selection slider",
                "key_props": ["value", "min", "max", "step", "orientation"],
                "events": ["onChange"]
            },
            "Date Time Picker": {
                "description": "Date and time selector",
                "key_props": ["value", "dateFormat", "showTime"],
                "events": ["onChange"]
            },
            "Time Series Chart": {
                "description": "Historical trend display",
                "key_props": ["plots", "axes", "timeRange"],
                "events": ["onDataClick", "onRangeChange"]
            },
            "XY Chart": {
                "description": "Scatter and line charts",
                "key_props": ["series", "xAxes", "yAxes"],
                "events": ["onClick", "onSelection"]
            },
            "Pie Chart": {
                "description": "Pie/donut chart display",
                "key_props": ["data", "innerRadius", "labels"],
                "events": ["onSliceClick"]
            },
            "Power Chart": {
                "description": "Advanced trending component",
                "key_props": ["pens", "tagBrowserConfig", "rangeSelector"],
                "events": ["onPenAdd", "onPenRemove", "onRangeChange"]
            }
        },
        "Data Components": {
            "Table": {
                "description": "Data grid with sorting/filtering",
                "key_props": ["data", "columns", "selection", "pager"],
                "events": ["onRowClick", "onCellClick", "onSort"]
            },
            "Tree": {
                "description": "Hierarchical tree view",
                "key_props": ["items", "selection", "appearance"],
                "events": ["onItemClick", "onExpand"]
            },
            "Alarm Status Table": {
                "description": "Live alarm display",
                "key_props": ["filters", "columns", "dateFormat"],
                "events": ["onAlarmAck", "onAlarmShelve"]
            },
            "Alarm Journal Table": {
                "description": "Historical alarm viewer",
                "key_props": ["startDate", "endDate", "filters"],
                "events": ["onSelectionChange"]
            }
        },
        "Media Components": {
            "Image": {
                "description": "Static or dynamic image display",
                "key_props": ["source", "fit", "altText"],
                "events": ["onClick", "onError"]
            },
            "Video Player": {
                "description": "Video playback component",
                "key_props": ["source", "autoplay", "controls"],
                "events": ["onPlay", "onPause", "onEnded"]
            },
            "PDF Viewer": {
                "description": "PDF document viewer",
                "key_props": ["source", "page", "zoom"],
                "events": ["onPageChange"]
            },
            "Web Frame": {
                "description": "Embedded web content",
                "key_props": ["source", "sandbox"],
                "events": []
            },
            "Map": {
                "description": "Interactive map display",
                "key_props": ["layers", "markers", "zoom", "center"],
                "events": ["onClick", "onMarkerClick"]
            }
        },
        "Drawing Components": {
            "Drawing Canvas": {
                "description": "Vector drawing surface",
                "key_props": ["elements", "viewBox", "preserveAspectRatio"],
                "events": ["onElementClick"]
            },
            "Pipe": {
                "description": "Industrial piping graphics",
                "key_props": ["origin", "terminus", "appearance"],
                "events": []
            }
        }
    }

    print("=== Perspective Component Library ===\n")
    total = 0
    for category, items in components.items():
        print(f"{category}: {len(items)} components")
        total += len(items)

    print(f"\nTotal Components: {total}")
    return components

if __name__ == "__main__":
    get_perspective_components()
```

## Component Property Bindings

```python
def component_binding_types():
    """Define Perspective binding types and examples"""

    bindings = {
        "Tag Binding": {
            "description": "Bind to tag values",
            "config": {
                "type": "tag",
                "path": "[default]Folder/TagName",
                "bidirectional": True,
                "overlay": {"enabled": False}
            },
            "example": '''
{
  "type": "tag",
  "path": "{view.params.tagPath}/Status",
  "transforms": [{
    "type": "map",
    "map": {
      "0": "Stopped",
      "1": "Running",
      "2": "Faulted"
    }
  }]
}
            '''
        },
        "Property Binding": {
            "description": "Bind to other component properties",
            "config": {
                "type": "property",
                "path": "this.props.value",
                "transforms": []
            }
        },
        "Expression Binding": {
            "description": "Use expressions for dynamic values",
            "config": {
                "type": "expr",
                "expression": "if({view.params.mode} = 'auto', 'Automatic', 'Manual')",
                "transforms": []
            }
        },
        "Query Binding": {
            "description": "Database query results",
            "config": {
                "type": "query",
                "query": "SELECT * FROM table WHERE id = :id",
                "params": {"id": "{view.params.recordId}"},
                "polling": {"enabled": True, "rate": 5000}
            }
        },
        "Expression Structure": {
            "description": "Create complex data structures",
            "config": {
                "type": "expr-struct",
                "struct": {
                    "label": "{[default]Machine/Name}",
                    "value": "{[default]Machine/Status}",
                    "color": "if({[default]Machine/Alarm}, '#FF0000', '#00FF00')"
                }
            }
        }
    }

    # Transform types
    transforms = {
        "Map": "Map input values to outputs",
        "Script": "Python script transformation",
        "Expression": "Expression-based transform",
        "Format": "String formatting"
    }

    return {
        "bindings": bindings,
        "transforms": transforms
    }
```

## Component Event Handling

```python
def perspective_event_system():
    """Perspective unified event system"""

    event_handlers = {
        "Component Events": {
            "onClick": '''
def onClick(self, event):
    """Handle component click"""
    # Navigate to another view
    system.perspective.navigate(
        page="/details",
        params={"id": self.props.itemId}
    )
''',
            "onChange": '''
def onChange(self, event):
    """Handle value change"""
    newValue = event.value

    # Write to tag
    system.tag.writeBlocking(
        ["[default]Settings/Setpoint"],
        [newValue]
    )

    # Show confirmation
    system.perspective.openPopup(
        id="confirm",
        view="Popups/Confirmation",
        params={"message": f"Value changed to {newValue}"}
    )
''',
            "onActionPerformed": '''
def onActionPerformed(self, event):
    """Handle button action"""
    action = self.props.action

    if action == "start":
        system.tag.write("[default]Control/Start", True)
    elif action == "stop":
        system.tag.write("[default]Control/Stop", True)
'''
        },
        "View Events": {
            "onStartup": '''
def onStartup(self, event):
    """Initialize view on startup"""
    # Set initial parameters
    self.params.timestamp = system.date.now()

    # Load data
    data = system.db.runNamedQuery(
        "GetInitialData",
        {"area": self.params.area}
    )

    self.custom.data = data
''',
            "onShutdown": '''
def onShutdown(self, event):
    """Cleanup on view shutdown"""
    # Save state
    system.perspective.setSessionProperty(
        "lastView",
        self.page.path
    )
'''
        },
        "Message Handlers": {
            "onMessage": '''
def onMessage(self, payload):
    """Handle inter-component messages"""
    messageType = payload.get("type")

    if messageType == "refresh":
        self.refreshBinding("props.data")
    elif messageType == "update":
        self.props.value = payload.get("value")
'''
        }
    }

    return event_handlers
```

## Responsive Design System

```python
def perspective_responsive_design():
    """Perspective responsive design features"""

    breakpoints = {
        "Small (Mobile)": {
            "min_width": 0,
            "max_width": 600,
            "columns": 1,
            "font_scale": 0.9
        },
        "Medium (Tablet)": {
            "min_width": 601,
            "max_width": 1024,
            "columns": 2,
            "font_scale": 1.0
        },
        "Large (Desktop)": {
            "min_width": 1025,
            "max_width": None,
            "columns": 3,
            "font_scale": 1.0
        }
    }

    responsive_properties = {
        "Column Container": {
            "breakpoint_configs": [
                {"small": 12, "medium": 6, "large": 4},
                {"small": 12, "medium": 6, "large": 4},
                {"small": 12, "medium": 12, "large": 4}
            ]
        },
        "Flex Container": {
            "responsive_props": {
                "direction": {"small": "column", "large": "row"},
                "wrap": {"small": "wrap", "large": "nowrap"}
            }
        },
        "View Canvas": {
            "aspectRatio": "16:9",
            "maintain_aspect": True,
            "scale_mode": "fit"
        }
    }

    return {
        "breakpoints": breakpoints,
        "responsive": responsive_properties
    }
```

## Component Styling

```python
def perspective_styling():
    """Perspective component styling system"""

    style_classes = {
        "Buttons": {
            "primary-button": {
                "backgroundColor": "#1E88E5",
                "color": "white",
                "borderRadius": "4px",
                "padding": "8px 16px",
                "fontSize": "14px",
                "fontWeight": "500"
            },
            "danger-button": {
                "backgroundColor": "#D32F2F",
                "color": "white"
            },
            "success-button": {
                "backgroundColor": "#43A047",
                "color": "white"
            }
        },
        "Containers": {
            "card": {
                "backgroundColor": "var(--neutral-10)",
                "borderRadius": "8px",
                "boxShadow": "0 2px 4px rgba(0,0,0,0.1)",
                "padding": "16px"
            },
            "header": {
                "backgroundColor": "var(--primary)",
                "color": "white",
                "padding": "12px 24px"
            }
        }
    }

    themes = {
        "Light Theme": {
            "--primary": "#1E88E5",
            "--secondary": "#FFC107",
            "--success": "#43A047",
            "--danger": "#D32F2F",
            "--neutral-10": "#FFFFFF",
            "--neutral-20": "#F5F5F5",
            "--neutral-80": "#424242",
            "--neutral-90": "#212121"
        },
        "Dark Theme": {
            "--primary": "#42A5F5",
            "--secondary": "#FFD54F",
            "--success": "#66BB6A",
            "--danger": "#EF5350",
            "--neutral-10": "#121212",
            "--neutral-20": "#1E1E1E",
            "--neutral-80": "#E0E0E0",
            "--neutral-90": "#F5F5F5"
        }
    }

    return {
        "classes": style_classes,
        "themes": themes
    }
```

## Advanced Component Features

```python
def advanced_component_features():
    """Advanced Perspective component capabilities"""

    features = {
        "Embedded Views": {
            "description": "Reusable view components",
            "usage": '''
# Pass parameters to embedded view
self.getChild("EmbeddedView").props.params = {
    "equipmentId": self.props.selectedEquipment,
    "mode": "details"
}

# Send message to embedded view
system.perspective.sendMessage(
    "UpdateData",
    payload={"data": newData},
    scope="view"
)
            '''
        },
        "Component Messaging": {
            "description": "Inter-component communication",
            "usage": '''
# Listen for messages
def onMessage(self, payload):
    if payload.get("action") == "refresh":
        self.refreshBinding("props.data")

# Send message to components
system.perspective.sendMessage(
    "RefreshAll",
    payload={"timestamp": system.date.now()},
    scope="page"
)
            '''
        },
        "Deep Selection": {
            "description": "Complex data selection in tables",
            "usage": '''
# Multi-level selection
selectedRows = self.props.selection.selectedRows
selectedColumns = self.props.selection.selectedColumns
selectedCells = self.props.selection.selectedCells

# Get selected data
for row in selectedRows:
    rowData = self.props.data[row]
    print(f"Selected: {rowData}")
            '''
        },
        "Custom Methods": {
            "description": "Component extension methods",
            "usage": '''
def refreshData(self):
    """Custom refresh method"""
    data = system.db.runNamedQuery(
        "GetLatestData",
        {"area": self.view.params.area}
    )
    self.props.data = data

# Call from event handler
self.refreshData()
            '''
        }
    }

    return features
```

## Performance Optimization

```python
def perspective_performance_tips():
    """Perspective performance optimization guidelines"""

    optimizations = {
        "Binding Optimization": {
            "use_transforms": "Process data in transforms vs scripts",
            "minimize_polling": "Use event-driven updates when possible",
            "batch_writes": "Write multiple tags in single operation",
            "cache_queries": "Enable query caching for static data"
        },
        "Component Best Practices": {
            "lazy_loading": "Load views on-demand",
            "virtualization": "Use virtualized tables for large datasets",
            "debounce_inputs": "Debounce rapid user inputs",
            "minimize_embedded": "Limit embedded view depth"
        },
        "Styling Performance": {
            "use_classes": "Prefer style classes over inline styles",
            "minimize_animations": "Limit CSS animations",
            "optimize_images": "Use appropriate image formats and sizes"
        },
        "Data Management": {
            "paginate_tables": "Use pagination for large tables",
            "filter_client_side": "Filter data on client when possible",
            "compress_datasets": "Use compressed data formats"
        }
    }

    return optimizations
```

## Documentation Links
- [Perspective Components](https://docs.inductiveautomation.com/docs/8.3/perspective/components)
- [Component Properties](https://docs.inductiveautomation.com/docs/8.3/perspective/components/properties)
- [Property Bindings](https://docs.inductiveautomation.com/docs/8.3/perspective/bindings)
- [Event System](https://docs.inductiveautomation.com/docs/8.3/perspective/events)