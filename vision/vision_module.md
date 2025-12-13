# Vision Module Configuration

## Module Parameters

```params
module: Vision
version: 8.3.0
client_type: Java Swing
deployment: launched_or_applet
memory_min: 256
memory_max: 1024
```

## Vision Module Overview

The Vision module is Ignition's original HMI/SCADA visualization platform, providing traditional desktop-based client applications using Java Swing technology.

## Check Vision Module Status

```python
#!/usr/bin/env python
import os
import json

def check_vision_module():
    """Check Vision module installation and configuration"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

    print("=== Vision Module Status ===\n")

    # Check module installation
    modules_dir = os.path.join(ignition_root, "data", "modules")
    if os.path.exists(modules_dir):
        vision_modules = [f for f in os.listdir(modules_dir)
                         if 'vision' in f.lower()]
        if vision_modules:
            print(f"[OK] Vision module found: {vision_modules}")
        else:
            print("[!] Vision module not installed")

    # Check client launcher
    launcher_path = os.path.join(ignition_root, "data", "clients")
    if os.path.exists(launcher_path):
        print(f"[OK] Client launcher directory exists")

    # Check for Vision projects
    projects_dir = os.path.join(ignition_root, "data", "projects")
    if os.path.exists(projects_dir):
        vision_projects = []
        for project in os.listdir(projects_dir):
            project_file = os.path.join(projects_dir, project, "project.json")
            if os.path.exists(project_file):
                with open(project_file, 'r') as f:
                    config = json.load(f)
                    if config.get("vision", {}).get("enabled", False):
                        vision_projects.append(project)

        print(f"Vision-enabled projects: {vision_projects}")

    return True

if __name__ == "__main__":
    check_vision_module()
```

## Vision Client Configuration

```python
def configure_vision_client():
    """Vision client launch configuration"""

    client_config = {
        "project": "VisionProject",
        "gateway_address": "localhost:8088",
        "initial_heap": 256,  # MB
        "max_heap": 1024,     # MB
        "screen_index": 0,
        "window_mode": "fullscreen",  # fullscreen, windowed, or maximized
        "jvm_args": [
            "-XX:+UseG1GC",
            "-XX:MaxGCPauseMillis=200",
            "-Dsun.java2d.noddraw=false"
        ],
        "client_tags": {
            "Client/System/HostName": "{hostname}",
            "Client/System/UserName": "{username}",
            "Client/System/ProjectName": "{project}"
        }
    }

    print("Vision Client Configuration:")
    print(json.dumps(client_config, indent=2))

    return client_config
```

## Window Types and Navigation

```python
def vision_window_types():
    """Define Vision window types and navigation"""

    window_types = {
        "Main Window": {
            "type": "main",
            "dockable": False,
            "closeable": False,
            "maximizable": True,
            "resizable": True,
            "start_maximized": True,
            "size": {"width": 1920, "height": 1080}
        },
        "Docked Window": {
            "type": "docked",
            "dock_position": "West",  # North, South, East, West
            "autoHide": False,
            "display_policy": "Always",
            "size": {"width": 250, "height": -1}
        },
        "Popup Window": {
            "type": "popup",
            "modal": True,
            "closeable": True,
            "resizable": False,
            "location": "center",
            "size": {"width": 600, "height": 400}
        }
    }

    navigation_strategies = {
        "tab_strip": "Use tab strip component for main navigation",
        "tree_view": "Hierarchical navigation with tree component",
        "button_navigation": "Direct navigation with buttons",
        "menu_bar": "Traditional menu bar navigation",
        "auto_navigation": "Script-based automatic navigation"
    }

    return {
        "windows": window_types,
        "navigation": navigation_strategies
    }
```

## Vision Components

```python
def vision_component_library():
    """Vision module component categories"""

    components = {
        "Basic": [
            "Label",
            "Button",
            "Text Field",
            "Text Area",
            "Dropdown",
            "Checkbox",
            "Radio Button",
            "Spinner"
        ],
        "Display": [
            "Table",
            "Power Table",
            "Tree View",
            "List",
            "Template Canvas",
            "Template Repeater",
            "Tab Strip"
        ],
        "Charts": [
            "Easy Chart",
            "Chart",
            "Bar Chart",
            "Pie Chart",
            "XY Chart",
            "Sparkline Chart"
        ],
        "Input": [
            "Numeric Text Field",
            "Formatted Text Field",
            "Calendar",
            "Date Range Selector",
            "Slider",
            "Touchscreen Keyboard"
        ],
        "Multimedia": [
            "Image",
            "PDF Viewer",
            "Web Browser",
            "IP Camera Viewer",
            "Video Player"
        ],
        "Shapes": [
            "Rectangle",
            "Circle",
            "Polygon",
            "Line",
            "Path",
            "Arrow"
        ],
        "Industrial": [
            "Tank",
            "Cylindrical Tank",
            "Thermometer",
            "LED Display",
            "Meter",
            "Linear Scale",
            "Progress Bar",
            "Level Indicator"
        ],
        "Alarming": [
            "Alarm Status Table",
            "Alarm Journal Table"
        ],
        "Reporting": [
            "Report Viewer"
        ]
    }

    print("=== Vision Component Library ===")
    for category, items in components.items():
        print(f"\n{category} ({len(items)} components):")
        for item in items[:3]:  # Show first 3
            print(f"  - {item}")
        if len(items) > 3:
            print(f"  ... and {len(items)-3} more")

    return components
```

## Vision Scripting

```python
def vision_scripting_events():
    """Vision scripting events and handlers"""

    script_events = {
        "Component Events": {
            "mouseClicked": "Triggered when component is clicked",
            "mouseEntered": "Mouse enters component bounds",
            "mouseExited": "Mouse leaves component bounds",
            "propertyChange": "Component property changes",
            "focusGained": "Component receives focus",
            "focusLost": "Component loses focus",
            "keyPressed": "Keyboard key pressed",
            "keyReleased": "Keyboard key released"
        },
        "Window Events": {
            "internalFrameOpened": "Window opens",
            "internalFrameClosing": "Window is closing",
            "internalFrameClosed": "Window closed",
            "internalFrameActivated": "Window activated",
            "visionWindowOpened": "Vision window opened"
        },
        "Client Events": {
            "startup": "Client starts up",
            "shutdown": "Client shuts down",
            "timer": "Periodic timer execution",
            "tag_change": "Client tag value changes",
            "menuBar": "Menu item selected"
        }
    }

    # Example event handler
    example_script = '''
def mouseClicked(event):
    """Handle mouse click on component"""
    import system

    # Get component that was clicked
    component = event.source

    # Navigate to a window
    system.nav.openWindow("Main Windows/Overview")

    # Or swap to different window
    system.nav.swapTo("Main Windows/Details",
                      {"equipmentId": component.equipmentId})

    # Open popup
    system.nav.openWindowInstance("Popups/Confirmation",
                                  {"message": "Confirm action?"})
    '''

    return {
        "events": script_events,
        "example": example_script
    }
```

## Vision Templates

```python
def create_vision_template():
    """Create reusable Vision templates"""

    template_definition = {
        "name": "MotorControl",
        "parameters": [
            {
                "name": "motorTagPath",
                "type": "String",
                "default": "[default]Motors/Motor1"
            },
            {
                "name": "motorName",
                "type": "String",
                "default": "Motor 1"
            },
            {
                "name": "showControls",
                "type": "Boolean",
                "default": True
            }
        ],
        "components": {
            "root": {
                "type": "container",
                "layout": "absolute",
                "size": {"width": 200, "height": 150}
            },
            "title": {
                "type": "label",
                "text": "{motorName}",
                "position": {"x": 10, "y": 10, "width": 180, "height": 25}
            },
            "status": {
                "type": "multiStateIndicator",
                "tagPath": "{motorTagPath}/Status",
                "position": {"x": 10, "y": 40, "width": 80, "height": 80}
            },
            "startButton": {
                "type": "button",
                "text": "Start",
                "visible": "{showControls}",
                "position": {"x": 100, "y": 40, "width": 90, "height": 35},
                "action": "system.tag.write('{motorTagPath}/Control/Start', True)"
            },
            "stopButton": {
                "type": "button",
                "text": "Stop",
                "visible": "{showControls}",
                "position": {"x": 100, "y": 85, "width": 90, "height": 35},
                "action": "system.tag.write('{motorTagPath}/Control/Stop', True)"
            }
        }
    }

    print("Vision Template Created:")
    print(f"Name: {template_definition['name']}")
    print(f"Parameters: {len(template_definition['parameters'])}")
    print(f"Components: {len(template_definition['components'])}")

    return template_definition
```

## Client Tags

```python
def configure_client_tags():
    """Configure Vision client tags"""

    client_tags = {
        "Client Tags": {
            "[Client]User/CurrentUser": {
                "type": "String",
                "value": "system.security.getUsername()"
            },
            "[Client]User/Roles": {
                "type": "String",
                "value": "system.security.getRoles()"
            },
            "[Client]System/ScreenResolution": {
                "type": "String",
                "value": "system.gui.getScreenSize()"
            },
            "[Client]System/CurrentWindow": {
                "type": "String",
                "value": "system.nav.getCurrentWindow()"
            },
            "[Client]System/IdleTime": {
                "type": "Integer",
                "value": "system.util.getInactivitySeconds()"
            }
        },
        "Client SQLTags": {
            "polling_rate": 250,  # ms
            "history_enabled": False,
            "cache_enabled": True
        }
    }

    print("Client Tag Configuration:")
    for tag, config in client_tags["Client Tags"].items():
        print(f"  {tag}: {config['type']}")

    return client_tags
```

## Vision Security

```python
def vision_security_settings():
    """Vision module security configuration"""

    security = {
        "component_security": {
            "enabled": True,
            "default_policy": "Authenticated",
            "policies": {
                "Public": "No authentication required",
                "Authenticated": "Any authenticated user",
                "Operator": "Operator role required",
                "Administrator": "Administrator role required"
            }
        },
        "window_security": {
            "require_all_roles": False,
            "cache_policy": True,
            "fallback_window": "Login"
        },
        "client_permissions": {
            "designer_access": ["Administrator", "Designer"],
            "runtime_access": ["Operator", "Administrator", "Viewer"],
            "retarget_enabled": False,
            "close_enabled": True
        }
    }

    # Security check script
    security_script = '''
def checkSecurity(requiredRole):
    """Check if user has required role"""
    import system

    roles = system.security.getRoles()
    username = system.security.getUsername()

    if requiredRole in roles:
        return True
    else:
        system.gui.messageBox(
            f"Access Denied. User {username} lacks {requiredRole} role."
        )
        return False
    '''

    return {
        "settings": security,
        "script": security_script
    }
```

## Performance Optimization

```python
def vision_performance_tips():
    """Vision client performance optimization"""

    optimizations = {
        "Memory Settings": {
            "initial_heap": "256MB minimum",
            "max_heap": "1024MB for standard clients",
            "gc_type": "G1GC for Java 8+"
        },
        "Component Best Practices": {
            "use_templates": "Reduce memory with reusable templates",
            "limit_bindings": "Minimize property bindings per window",
            "optimize_polling": "Use slower rates for non-critical data",
            "cache_datasets": "Cache static datasets client-side"
        },
        "Window Management": {
            "close_unused": "Close windows when not needed",
            "limit_open_windows": "Maximum 10-15 windows open",
            "use_cache": "Enable window cache for frequently used",
            "lazy_loading": "Load data only when window opens"
        },
        "Query Optimization": {
            "use_named_queries": "Precompiled and cached",
            "limit_rows": "Retrieve only necessary data",
            "async_queries": "Use background threads for long queries"
        }
    }

    print("Vision Performance Guidelines:")
    for category, tips in optimizations.items():
        print(f"\n{category}:")
        for key, value in tips.items():
            print(f"  - {key}: {value}")

    return optimizations
```

## Documentation Links
- [Vision Module Guide](https://docs.inductiveautomation.com/docs/8.3/vision-module)
- [Vision Components](https://docs.inductiveautomation.com/docs/8.3/vision-module/components)
- [Vision Scripting](https://docs.inductiveautomation.com/docs/8.3/vision-module/scripting)