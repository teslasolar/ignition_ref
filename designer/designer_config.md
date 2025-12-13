# Designer Configuration Reference

## Designer Parameters

```params
designer_path: C:\Program Files\Inductive Automation\Ignition\data\designer
launcher_path: C:\Users\%USERNAME%\.ignition\clientlauncher-data
memory_min: 512
memory_max: 2048
jvm_args: -XX:+UseG1GC
```

## Check Designer Configuration

```python
#!/usr/bin/env python
import os
import json
import xml.etree.ElementTree as ET

def check_designer_config():
    """Check Designer configuration and launcher settings"""
    print("=== Designer Configuration Check ===\n")

    # Check client launcher data
    launcher_path = os.path.expanduser(r"~\.ignition\clientlauncher-data")
    if os.path.exists(launcher_path):
        print(f"✓ Launcher data found: {launcher_path}")

        # Check for designer launchers
        launchers = os.path.join(launcher_path, "designer-launchers")
        if os.path.exists(launchers):
            files = os.listdir(launchers)
            print(f"  Designer launchers: {len(files)}")
    else:
        print("✗ No launcher data found")

    # Check for designer resources in Ignition
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"
    designer_lib = os.path.join(ignition_root, "lib", "core", "designer")

    if os.path.exists(designer_lib):
        jar_files = [f for f in os.listdir(designer_lib) if f.endswith('.jar')]
        print(f"✓ Designer libraries: {len(jar_files)} JAR files")
    else:
        print("✗ Designer libraries not found")

    # Check for global resource files
    global_props = os.path.join(ignition_root, "data", "projects", "_global_")
    if os.path.exists(global_props):
        print("✓ Global designer resources found")

    print("\n=== Designer Memory Settings ===")
    print("  Recommended: 1024-4096 MB")
    print("  Minimum: 512 MB")
    print("  For large projects: 4096+ MB")

if __name__ == "__main__":
    check_designer_config()
```

## Designer Resources

### Resource Types
- **Templates** - Reusable component templates
- **Scripts** - Project and shared scripts
- **Styles** - CSS and theme definitions
- **Images** - Project image resources
- **Windows** - Vision windows (if Vision module installed)
- **Views** - Perspective views and components

### File Locations

| Resource Type | Location |
|--------------|----------|
| **Project Resources** | `data\projects\[ProjectName]\ignition\` |
| **Global Resources** | `data\projects\_global_\` |
| **Script Library** | `data\projects\[ProjectName]\ignition\script-library\` |
| **Named Queries** | `data\projects\[ProjectName]\ignition\named-query\` |
| **Images** | `data\projects\[ProjectName]\ignition\images\` |

## Designer Launcher Configuration

### JVM Arguments
```
-Xms512m
-Xmx2048m
-XX:+UseG1GC
-Djavafx.animation.framerate=60
-Dsun.java2d.d3d=false
```

### Network Settings
- **Gateway Address**: Configure in launcher
- **SSL Settings**: Accept certificates
- **Proxy Configuration**: System or manual

## Common Designer Issues

### Memory Issues
```python
def check_designer_memory():
    """Check if Designer has enough memory"""
    import psutil

    # Get system memory
    mem = psutil.virtual_memory()
    available_gb = mem.available / (1024**3)

    print(f"Available RAM: {available_gb:.2f} GB")

    if available_gb < 2:
        print("⚠ Low memory - Designer may be slow")
    else:
        print("✓ Sufficient memory for Designer")
```

### Performance Optimization
- Increase heap memory for large projects
- Disable unnecessary modules
- Clear Designer cache regularly
- Use project inheritance wisely

## Designer Cache

### Cache Locations
```python
def clear_designer_cache():
    """Clear Designer cache files"""
    cache_dirs = [
        os.path.expanduser(r"~\.ignition\cache"),
        os.path.expanduser(r"~\.ignition\clientlauncher-data\cache"),
        os.path.expanduser(r"~\AppData\Local\Temp\ignition")
    ]

    for cache_dir in cache_dirs:
        if os.path.exists(cache_dir):
            print(f"Found cache: {cache_dir}")
            # Size calculation
            size = sum(os.path.getsize(os.path.join(dirpath, f))
                      for dirpath, _, filenames in os.walk(cache_dir)
                      for f in filenames)
            print(f"  Size: {size / (1024*1024):.2f} MB")
```

## Documentation Links
- [Designer Guide](https://docs.inductiveautomation.com/docs/8.3/designer)
- [Designer Launcher](https://docs.inductiveautomation.com/docs/8.3/designer/designer-launcher)