# Ignition Component Extractor

Automated extraction tool for documenting Ignition components into executable markdown files.

## Extraction Parameters

```params
ignition_root: C:\Program Files\Inductive Automation\Ignition
output_dir: ignition_ref
max_file_size: 10485760
include_hidden: false
```

## Main Extraction Script

```python
#!/usr/bin/env python
import os
import json
import glob
import sqlite3
import xml.etree.ElementTree as ET
from datetime import datetime

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"
output_base = "ignition_ref"

class IgnitionExtractor:
    """Extract Ignition components to markdown documentation"""

    def __init__(self, root_path=ignition_root):
        self.root = root_path
        self.extracted = []
        self.failed = []

    def scan_projects(self):
        """Scan all projects for extractable components"""
        print("=== Scanning Ignition Projects ===\n")

        projects_dir = os.path.join(self.root, "data", "projects")
        if not os.path.exists(projects_dir):
            print("✗ Projects directory not found")
            return []

        projects = []
        for project in os.listdir(projects_dir):
            project_path = os.path.join(projects_dir, project)
            if os.path.isdir(project_path):
                projects.append(project)
                print(f"✓ Found project: {project}")

                # Scan project structure
                self.scan_project_components(project_path, project)

        return projects

    def scan_project_components(self, project_path, project_name):
        """Scan individual project for components"""
        ignition_dir = os.path.join(project_path, "ignition")

        if not os.path.exists(ignition_dir):
            return

        components = {
            "gateway-scripts": "Gateway Scripts",
            "named-query": "Named Queries",
            "perspective": "Perspective Resources",
            "vision": "Vision Resources",
            "reports": "Report Templates",
            "webdev": "WebDev Resources",
            "script-library": "Script Library",
            "tags": "Tag Configurations",
            "images": "Image Resources"
        }

        found = []
        for folder, name in components.items():
            comp_path = os.path.join(ignition_dir, folder)
            if os.path.exists(comp_path):
                file_count = len(glob.glob(os.path.join(comp_path, "**/*"), recursive=True))
                if file_count > 0:
                    print(f"  • {name}: {file_count} files")
                    found.append((folder, comp_path, file_count))

        return found

    def extract_gateway_scripts(self):
        """Extract gateway event scripts"""
        print("\n=== Extracting Gateway Scripts ===")

        output_file = f"{output_base}/scripting/gateway_scripts.md"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        content = '''# Gateway Event Scripts

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
    """Find all gateway event scripts"""
    ignition_root = r"C:\\Program Files\\Inductive Automation\\Ignition"
    scripts_found = {}

    # Script types to search for
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
            print(f"\\nProject: {project}")
            for script_type, description in script_types.items():
                type_path = os.path.join(scripts_dir, script_type)
                if os.path.exists(type_path):
                    files = glob.glob(os.path.join(type_path, "*.json"))
                    if files:
                        print(f"  ✓ {description}: {len(files)} scripts")
                        scripts_found[f"{project}/{script_type}"] = files

    return scripts_found

if __name__ == "__main__":
    scripts = find_gateway_scripts()
    print(f"\\nTotal script locations: {len(scripts)}")
```

## Timer Scripts Configuration

```python
def configure_timer_script():
    """Timer script configuration template"""
    timer_config = {
        "name": "DataCollection",
        "delay": 60000,  # milliseconds
        "fixedDelay": True,
        "enabled": True,
        "script": """
# Timer script executes every 60 seconds
import system

# Collect system metrics
cpu_usage = system.util.getSystemMetric("cpu")
memory_usage = system.util.getSystemMetric("memory")

# Log metrics
logger = system.util.getLogger("Metrics")
logger.info(f"CPU: {cpu_usage}%, Memory: {memory_usage}%")

# Write to tags
system.tag.writeBlocking(
    ["[default]Metrics/CPU", "[default]Metrics/Memory"],
    [cpu_usage, memory_usage]
)
"""
    }

    return timer_config
```

## Message Handler Configuration

```python
def configure_message_handler():
    """Message handler configuration"""
    handler = {
        "name": "ProcessCommand",
        "messageType": "Command",
        "scope": "Gateway",
        "script": """
def handleMessage(payload):
    \"\"\"Handle incoming message\"\"\"
    command = payload.get("command")
    params = payload.get("params", {})

    if command == "restart":
        system.util.restart()
    elif command == "backup":
        system.util.backup()

    return {"status": "success", "command": command}
"""
    }

    return handler
```'''

        with open(output_file, 'w') as f:
            f.write(content)

        print(f"✓ Created: {output_file}")
        self.extracted.append(output_file)

    def extract_named_queries(self):
        """Extract named query configurations"""
        print("\n=== Extracting Named Queries ===")

        output_file = f"{output_base}/database/named_queries_list.md"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        content = '''# Named Query Configurations

## Query Parameters

```params
database: default
cache_enabled: true
cache_timeout: 60
fallback_enabled: true
```

## Extract Named Queries

```python
#!/usr/bin/env python
import os
import json
import glob

def extract_named_queries():
    """Extract all named query definitions"""
    ignition_root = r"C:\\Program Files\\Inductive Automation\\Ignition"
    queries = []

    projects_dir = os.path.join(ignition_root, "data", "projects")

    for project in os.listdir(projects_dir):
        query_dir = os.path.join(projects_dir, project, "ignition", "named-query")

        if os.path.exists(query_dir):
            query_files = glob.glob(os.path.join(query_dir, "**/*.json"), recursive=True)

            for query_file in query_files:
                try:
                    with open(query_file, 'r') as f:
                        query_data = json.load(f)

                    query_info = {
                        "project": project,
                        "path": os.path.relpath(query_file, query_dir),
                        "type": query_data.get("type", "Query"),
                        "database": query_data.get("database", "default")
                    }

                    queries.append(query_info)
                    print(f"✓ {project}: {query_info['path']}")

                except Exception as e:
                    print(f"✗ Error reading {query_file}: {e}")

    print(f"\\nTotal queries found: {len(queries)}")
    return queries

if __name__ == "__main__":
    extract_named_queries()
```

## Query Template

```python
def create_query_template():
    """Create named query template"""
    query = {
        "name": "GetProductionMetrics",
        "type": "Query",
        "database": "default",
        "project": "default",
        "caching": {
            "enabled": True,
            "timeoutSeconds": 60
        },
        "authRequired": False,
        "fallback": {
            "enabled": True,
            "query": "SELECT * FROM production_metrics_backup WHERE timestamp > :startDate"
        },
        "query": """
SELECT
    timestamp,
    machine_id,
    production_count,
    efficiency,
    quality_score
FROM production_metrics
WHERE timestamp BETWEEN :startDate AND :endDate
    AND machine_id = :machineId
ORDER BY timestamp DESC
        """,
        "parameters": [
            {
                "name": "startDate",
                "type": "DateTime",
                "defaultValue": "now(-1h)"
            },
            {
                "name": "endDate",
                "type": "DateTime",
                "defaultValue": "now()"
            },
            {
                "name": "machineId",
                "type": "String",
                "defaultValue": ""
            }
        ]
    }

    return query
```'''

        with open(output_file, 'w') as f:
            f.write(content)

        print(f"✓ Created: {output_file}")
        self.extracted.append(output_file)

    def extract_perspective_resources(self):
        """Extract Perspective view resources"""
        print("\n=== Extracting Perspective Resources ===")

        output_file = f"{output_base}/perspective/view_resources.md"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        content = '''# Perspective View Resources

## View Parameters

```params
project: default
view_path: Views/
resource_types: json,css,svg
session_timeout: 900
```

## Extract Perspective Views

```python
#!/usr/bin/env python
import os
import json
import glob

def extract_perspective_views():
    """Extract all Perspective views and resources"""
    ignition_root = r"C:\\Program Files\\Inductive Automation\\Ignition"
    resources = {
        "views": [],
        "styles": [],
        "scripts": []
    }

    projects_dir = os.path.join(ignition_root, "data", "projects")

    for project in os.listdir(projects_dir):
        perspective_dir = os.path.join(projects_dir, project, "ignition", "perspective")

        if os.path.exists(perspective_dir):
            print(f"\\nProject: {project}")

            # Extract views
            views_dir = os.path.join(perspective_dir, "views")
            if os.path.exists(views_dir):
                view_files = glob.glob(os.path.join(views_dir, "**/*.json"), recursive=True)
                print(f"  Views: {len(view_files)}")
                resources["views"].extend(view_files)

            # Extract styles
            styles_dir = os.path.join(perspective_dir, "styles")
            if os.path.exists(styles_dir):
                style_files = glob.glob(os.path.join(styles_dir, "*.css"))
                print(f"  Styles: {len(style_files)}")
                resources["styles"].extend(style_files)

            # Extract session scripts
            scripts_dir = os.path.join(perspective_dir, "session-scripts")
            if os.path.exists(scripts_dir):
                script_files = glob.glob(os.path.join(scripts_dir, "*.py"))
                print(f"  Scripts: {len(script_files)}")
                resources["scripts"].extend(script_files)

    return resources

if __name__ == "__main__":
    resources = extract_perspective_views()
    total = sum(len(v) for v in resources.values())
    print(f"\\nTotal resources: {total}")
```

## View Configuration Template

```python
def create_view_template():
    """Create Perspective view template"""
    view = {
        "type": "view",
        "version": 1,
        "params": {
            "machineId": {
                "type": "value",
                "defaultValue": ""
            }
        },
        "root": {
            "type": "container",
            "children": [
                {
                    "type": "label",
                    "props": {
                        "text": "Machine Dashboard"
                    },
                    "position": {
                        "x": 10,
                        "y": 10,
                        "width": 200,
                        "height": 40
                    }
                },
                {
                    "type": "numeric-entry",
                    "props": {
                        "value": {
                            "binding": {
                                "type": "tag",
                                "path": "[default]Machines/{view.params.machineId}/Speed"
                            }
                        }
                    }
                }
            ]
        }
    }

    return view
```'''

        with open(output_file, 'w') as f:
            f.write(content)

        print(f"✓ Created: {output_file}")
        self.extracted.append(output_file)

    def extract_webdev_resources(self):
        """Extract WebDev module resources"""
        print("\n=== Extracting WebDev Resources ===")

        output_file = f"{output_base}/webdev/webdev_resources.md"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        content = '''# WebDev Module Resources

## WebDev Parameters

```params
project: default
resource_path: /system/webdev/
methods: GET,POST,PUT,DELETE
auth_required: false
```

## Extract WebDev Endpoints

```python
#!/usr/bin/env python
import os
import glob

def extract_webdev_resources():
    """Extract all WebDev resources and endpoints"""
    ignition_root = r"C:\\Program Files\\Inductive Automation\\Ignition"
    endpoints = []

    projects_dir = os.path.join(ignition_root, "data", "projects")

    for project in os.listdir(projects_dir):
        webdev_dir = os.path.join(projects_dir, project, "ignition", "webdev")

        if os.path.exists(webdev_dir):
            print(f"\\nProject: {project}")

            # Find Python resources
            py_files = glob.glob(os.path.join(webdev_dir, "**/*.py"), recursive=True)
            for py_file in py_files:
                endpoint = os.path.relpath(py_file, webdev_dir).replace("\\\\", "/")
                endpoints.append({
                    "project": project,
                    "endpoint": endpoint,
                    "type": "python"
                })
                print(f"  ✓ Python: {endpoint}")

            # Find web resources
            web_files = glob.glob(os.path.join(webdev_dir, "**/*.html"), recursive=True)
            web_files.extend(glob.glob(os.path.join(webdev_dir, "**/*.js"), recursive=True))
            web_files.extend(glob.glob(os.path.join(webdev_dir, "**/*.css"), recursive=True))

            for web_file in web_files:
                resource = os.path.relpath(web_file, webdev_dir).replace("\\\\", "/")
                print(f"  ✓ Resource: {resource}")

    return endpoints

if __name__ == "__main__":
    endpoints = extract_webdev_resources()
    print(f"\\nTotal endpoints: {len(endpoints)}")
```

## WebDev Endpoint Template

```python
def create_webdev_endpoint():
    """Create WebDev Python resource template"""

    endpoint = '''
def doGet(request, session):
    """Handle GET requests"""
    import system
    import json

    # Get query parameters
    machine_id = request.get("params").get("machine_id", "")

    if not machine_id:
        return {
            "status": 400,
            "content": json.dumps({"error": "machine_id required"})
        }

    # Read tag values
    tag_paths = [
        f"[default]Machines/{machine_id}/Speed",
        f"[default]Machines/{machine_id}/Temperature",
        f"[default]Machines/{machine_id}/Status"
    ]

    values = system.tag.readBlocking(tag_paths)

    response = {
        "machine_id": machine_id,
        "speed": values[0].value,
        "temperature": values[1].value,
        "status": values[2].value,
        "timestamp": system.date.now()
    }

    return {
        "status": 200,
        "content": json.dumps(response),
        "headers": {"Content-Type": "application/json"}
    }

def doPost(request, session):
    """Handle POST requests"""
    import system
    import json

    # Parse JSON body
    body = request.get("data")
    data = json.loads(body)

    machine_id = data.get("machine_id")
    command = data.get("command")

    # Execute command
    if command == "start":
        system.tag.writeBlocking(
            [f"[default]Machines/{machine_id}/Control/Start"],
            [True]
        )

    return {
        "status": 200,
        "content": json.dumps({"success": True})
    }
'''

    return endpoint
```'''

        with open(output_file, 'w') as f:
            f.write(content)

        print(f"✓ Created: {output_file}")
        self.extracted.append(output_file)

    def generate_extraction_report(self):
        """Generate extraction summary report"""
        print("\n=== Extraction Summary ===")

        report = {
            "timestamp": datetime.now().isoformat(),
            "extracted": len(self.extracted),
            "failed": len(self.failed),
            "files": self.extracted
        }

        report_file = f"{output_base}/EXTRACTION_REPORT.md"

        content = f'''# Extraction Report

Generated: {report["timestamp"]}

## Summary
- Successfully extracted: {report["extracted"]} components
- Failed extractions: {report["failed"]}

## Extracted Files
'''

        for file in self.extracted:
            content += f"- ✓ {file}\n"

        with open(report_file, 'w') as f:
            f.write(content)

        print(f"✓ Report generated: {report_file}")

    def run_extraction(self):
        """Run complete extraction process"""
        print("=== Starting Ignition Component Extraction ===\n")

        # Check if Ignition is accessible
        if not os.path.exists(self.root):
            print(f"✗ Ignition not found at: {self.root}")
            return False

        print(f"✓ Ignition found: {self.root}\n")

        # Run extraction phases
        self.scan_projects()
        self.extract_gateway_scripts()
        self.extract_named_queries()
        self.extract_perspective_resources()
        self.extract_webdev_resources()

        # Generate report
        self.generate_extraction_report()

        print("\n=== Extraction Complete ===")
        return True

# Execute extraction
if __name__ == "__main__":
    extractor = IgnitionExtractor()
    extractor.run_extraction()
```