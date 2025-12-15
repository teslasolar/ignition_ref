# Docking System Quick Start Guide

## 5-Minute Quick Start

### Step 1: Understand the Layout

```
┌─────────────────────────────────────┐
│           NORTH DOCK                │
├──────────┬──────────────┬───────────┤
│          │              │           │
│   WEST   │    CENTER    │   EAST    │
│   DOCK   │   (Main)     │   DOCK    │
│          │              │           │
├──────────┴──────────────┴───────────┤
│           SOUTH DOCK                │
└─────────────────────────────────────┘
```

### Step 2: Choose a Template

Available templates:
- `default` - All docks enabled (general use)
- `dashboard` - Only north/south (clean dashboards)
- `process` - All docks (process monitoring)
- `diagnostic` - Large east panel (diagnostics)
- `editor` - All docks with large panels (editing)
- `fullscreen` - No docks (presentations)
- `split` - 50/50 east/west (comparisons)
- `minimal` - Side panels collapsed (focused work)

### Step 3: Create Your First Docked View

**Minimal Example:**

```json
{
  "id": "my-view",
  "name": "My View",
  "metadata": {
    "title": "My First Docked View",
    "padding": "0px"
  },
  "docking": {
    "template": "default",
    "north": {
      "component": {
        "type": "label",
        "props": {
          "text": "My Application Title",
          "variant": "heading"
        }
      }
    },
    "center": {
      "component": {
        "type": "container",
        "props": {
          "padding": "20px"
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Main content goes here"
            }
          }
        ]
      }
    }
  }
}
```

### Step 4: Test It

1. Save your view JSON file
2. Reload the application
3. Navigate to your view
4. Try collapsing docks (click the arrow buttons)
5. Try resizing docks (drag the borders)

## Common Patterns

### Pattern 1: Navigation in West Dock

```json
{
  "west": {
    "component": {
      "type": "container",
      "props": {
        "type": "flex",
        "direction": "column",
        "gap": 5
      },
      "children": [
        {
          "type": "button",
          "props": {
            "text": "Home",
            "style": { "width": "100%" }
          }
        },
        {
          "type": "button",
          "props": {
            "text": "Settings",
            "style": { "width": "100%" }
          }
        }
      ]
    }
  }
}
```

### Pattern 2: Properties in East Dock

```json
{
  "east": {
    "component": {
      "type": "container",
      "props": {
        "type": "flex",
        "direction": "column",
        "gap": 10
      },
      "children": [
        {
          "type": "label",
          "props": {
            "text": "Properties",
            "variant": "subheading"
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
                "text": "Value:",
                "className": "dock-property-label"
              }
            },
            {
              "type": "label",
              "props": {
                "bindings": { "text": "Path/To/Tag" },
                "className": "dock-property-value"
              }
            }
          ]
        }
      ]
    }
  }
}
```

### Pattern 3: Status Bar in South Dock

```json
{
  "south": {
    "component": {
      "type": "container",
      "props": {
        "type": "flex",
        "direction": "row",
        "justifyContent": "space-between",
        "alignItems": "center",
        "padding": "5px 15px"
      },
      "children": [
        {
          "type": "label",
          "props": {
            "text": "Status: Online",
            "style": { "color": "#66bb6a" }
          }
        },
        {
          "type": "label",
          "props": {
            "text": "Last Update: Now"
          }
        }
      ]
    }
  }
}
```

### Pattern 4: Toolbar in North Dock

```json
{
  "north": {
    "component": {
      "type": "container",
      "props": {
        "type": "flex",
        "direction": "row",
        "justifyContent": "space-between",
        "alignItems": "center",
        "padding": "10px 15px"
      },
      "children": [
        {
          "type": "label",
          "props": {
            "text": "Dashboard",
            "variant": "heading"
          }
        },
        {
          "type": "container",
          "props": {
            "type": "flex",
            "direction": "row",
            "gap": 10
          },
          "children": [
            {
              "type": "button",
              "props": {
                "text": "Refresh",
                "variant": "primary"
              }
            },
            {
              "type": "button",
              "props": {
                "text": "Settings",
                "variant": "default"
              }
            }
          ]
        }
      ]
    }
  }
}
```

## Keyboard Shortcuts

- `Ctrl+Shift+N` - Toggle North dock
- `Ctrl+Shift+S` - Toggle South dock
- `Ctrl+Shift+E` - Toggle East dock
- `Ctrl+Shift+W` - Toggle West dock
- `Ctrl+D` - Toggle debug mode
- `Ctrl+R` - Refresh view

## Tips

1. **Start Simple** - Use only north and center for your first view
2. **Add Gradually** - Add more docks as you need them
3. **Test Responsive** - Check how it looks on small screens
4. **Use Templates** - Don't reinvent the wheel
5. **Keep Consistent** - Use similar layouts across views

## Common Mistakes

### ❌ Don't Do This:
```json
{
  "metadata": {
    "padding": "20px"  // ❌ Padding conflicts with docks
  },
  "docking": {
    "center": {
      "type": "container"  // ❌ Missing "component" wrapper
    }
  }
}
```

### ✅ Do This:
```json
{
  "metadata": {
    "padding": "0px"  // ✅ No padding on docked views
  },
  "docking": {
    "center": {
      "component": {  // ✅ Component wrapper present
        "type": "container",
        "props": { "padding": "20px" }  // ✅ Padding on container
      }
    }
  }
}
```

## Next Steps

1. Read the full documentation: `DOCKING_SYSTEM.md`
2. Study the example: `views/overview.json`
3. Experiment with different templates
4. Create custom dock layouts
5. Add interactivity with bindings and actions

## Need Help?

1. Check browser console for errors
2. Verify JSON syntax is valid
3. Ensure all components are registered
4. Review the full documentation
5. Inspect the example views

## Example: Complete Docked View

```json
{
  "id": "complete-example",
  "name": "Complete Example",
  "metadata": {
    "title": "Complete Docked View Example",
    "backgroundColor": "#1e1e1e",
    "padding": "0px"
  },
  "docking": {
    "template": "default",
    "north": {
      "component": {
        "type": "container",
        "props": {
          "type": "flex",
          "direction": "row",
          "justifyContent": "space-between",
          "padding": "10px 15px"
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Application Title",
              "variant": "heading"
            }
          },
          {
            "type": "button",
            "props": {
              "text": "Menu",
              "variant": "primary"
            }
          }
        ]
      }
    },
    "west": {
      "component": {
        "type": "container",
        "props": {
          "type": "flex",
          "direction": "column",
          "gap": 5
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Navigation",
              "variant": "subheading"
            }
          },
          {
            "type": "button",
            "props": {
              "text": "Dashboard",
              "style": { "width": "100%" }
            }
          },
          {
            "type": "button",
            "props": {
              "text": "Reports",
              "style": { "width": "100%" }
            }
          }
        ]
      }
    },
    "center": {
      "component": {
        "type": "container",
        "props": {
          "padding": "20px",
          "type": "flex",
          "direction": "column",
          "gap": 15
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Welcome!",
              "variant": "heading"
            }
          },
          {
            "type": "label",
            "props": {
              "text": "This is the main content area."
            }
          }
        ]
      }
    },
    "east": {
      "component": {
        "type": "container",
        "props": {
          "type": "flex",
          "direction": "column",
          "gap": 10
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Details",
              "variant": "subheading"
            }
          },
          {
            "type": "label",
            "props": {
              "text": "Additional information here"
            }
          }
        ]
      }
    },
    "south": {
      "component": {
        "type": "container",
        "props": {
          "type": "flex",
          "direction": "row",
          "justifyContent": "space-between",
          "padding": "5px 15px"
        },
        "children": [
          {
            "type": "label",
            "props": {
              "text": "Status: Ready"
            }
          },
          {
            "type": "label",
            "props": {
              "text": "© 2024"
            }
          }
        ]
      }
    }
  }
}
```

This example shows all five dock regions in use with a complete, working layout!
