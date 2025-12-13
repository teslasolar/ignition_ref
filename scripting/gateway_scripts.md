# Gateway Event Scripts

## Overview
Found 0 gateway scripts across the following types:


## Script Parameters

```params
project: default
script_types: timer,tag_change,startup,shutdown,message
execution_context: gateway
```

## Check Gateway Scripts

```python
#!/usr/bin/env python
import os
import json
import glob

def find_gateway_scripts():
    '''Find all gateway event scripts'''
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"
    scripts_found = {}

    script_types = {
        "timer": "Timer Scripts (scheduled execution)",
        "tag-change": "Tag Change Scripts",
        "startup": "Gateway Startup Script",
        "shutdown": "Gateway Shutdown Script",
        "message": "Message Handler Scripts"
    }

    projects_dir = os.path.join(ignition_root, "data", "projects")

    for project in os.listdir(projects_dir):
        project_path = os.path.join(projects_dir, project)
        scripts_dir = os.path.join(project_path, "ignition", "gateway-scripts")

        if os.path.exists(scripts_dir):
            print(f"\nProject: {project}")
            for script_type, description in script_types.items():
                type_path = os.path.join(scripts_dir, script_type)
                if os.path.exists(type_path):
                    files = glob.glob(os.path.join(type_path, "*.json"))
                    if files:
                        print(f"  [OK] {description}: {len(files)} scripts")
                        scripts_found[f"{project}/{script_type}"] = files

    return scripts_found

if __name__ == "__main__":
    scripts = find_gateway_scripts()
    print(f"\nTotal script locations: {len(scripts)}")
```
