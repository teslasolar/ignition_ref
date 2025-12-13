# Script Library Documentation

## Library Parameters

```params
project: default
path: script-library
language: python
version: 2.7
```

## Check Script Library

```python
#!/usr/bin/env python
import os
import glob

def scan_script_library():
    """Scan Ignition script library for shared scripts"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"
    libraries = {}

    projects_dir = os.path.join(ignition_root, "data", "projects")

    for project in os.listdir(projects_dir):
        library_dir = os.path.join(projects_dir, project, "ignition", "script-library")

        if os.path.exists(library_dir):
            print(f"\nProject: {project}")
            py_files = glob.glob(os.path.join(library_dir, "**/*.py"), recursive=True)

            for py_file in py_files:
                module_name = os.path.relpath(py_file, library_dir).replace("\\", ".").replace(".py", "")
                print(f"  Module: {module_name}")
                libraries[f"{project}.{module_name}"] = py_file

    return libraries

if __name__ == "__main__":
    libs = scan_script_library()
    print(f"\nTotal library modules: {len(libs)}")
```

## Common Utility Functions

### Database Utilities

```python
def database_utils():
    """Common database operation functions"""

    def execute_query(query, params=None, database="default"):
        """Execute a database query with error handling"""
        import system

        try:
            if params:
                result = system.db.runPrepQuery(query, params, database)
            else:
                result = system.db.runQuery(query, database)
            return result
        except Exception as e:
            system.util.getLogger("DB").error(f"Query failed: {e}")
            return None

    def batch_insert(table, data, database="default"):
        """Batch insert data into a table"""
        import system

        if not data:
            return False

        columns = list(data[0].keys())
        placeholders = ", ".join(["?"] * len(columns))
        column_list = ", ".join(columns)

        query = f"INSERT INTO {table} ({column_list}) VALUES ({placeholders})"

        rows = [[row[col] for col in columns] for row in data]

        try:
            system.db.runPrepBatch(query, rows, database)
            return True
        except Exception as e:
            system.util.getLogger("DB").error(f"Batch insert failed: {e}")
            return False

    return {
        "execute_query": execute_query,
        "batch_insert": batch_insert
    }
```

### Tag Operations

```python
def tag_operations():
    """Common tag operation utilities"""

    def read_tags_safe(paths, default_value=None):
        """Read tags with error handling and default values"""
        import system

        try:
            values = system.tag.readBlocking(paths)
            result = []

            for value in values:
                if value.quality.isGood():
                    result.append(value.value)
                else:
                    result.append(default_value)

            return result
        except Exception as e:
            system.util.getLogger("Tags").error(f"Tag read failed: {e}")
            return [default_value] * len(paths)

    def write_tags_safe(paths, values):
        """Write tags with error handling"""
        import system

        try:
            results = system.tag.writeBlocking(paths, values)
            success = all([r.isGood() for r in results])

            if not success:
                failed = [paths[i] for i, r in enumerate(results) if not r.isGood()]
                system.util.getLogger("Tags").warn(f"Failed to write: {failed}")

            return success
        except Exception as e:
            system.util.getLogger("Tags").error(f"Tag write failed: {e}")
            return False

    return {
        "read_safe": read_tags_safe,
        "write_safe": write_tags_safe
    }
```

### Alarm Utilities

```python
def alarm_utilities():
    """Common alarm handling utilities"""

    def get_active_alarms(path="*", state=["ActiveUnacked", "ActiveAcked"]):
        """Get active alarms for a path"""
        import system

        try:
            alarms = system.alarm.queryStatus(
                path=[path],
                state=state
            )

            return [{
                "name": alarm.getName(),
                "path": alarm.getPath(),
                "priority": alarm.getPriority(),
                "state": alarm.getState(),
                "timestamp": alarm.getActiveTime()
            } for alarm in alarms]

        except Exception as e:
            system.util.getLogger("Alarms").error(f"Alarm query failed: {e}")
            return []

    def acknowledge_alarm(path, notes="Acknowledged via script"):
        """Acknowledge an alarm"""
        import system

        try:
            system.alarm.acknowledge([path], notes)
            return True
        except Exception as e:
            system.util.getLogger("Alarms").error(f"Acknowledge failed: {e}")
            return False

    return {
        "get_active": get_active_alarms,
        "acknowledge": acknowledge_alarm
    }
```

### Date/Time Utilities

```python
def datetime_utils():
    """Date and time manipulation utilities"""

    def get_shift_times():
        """Get current shift start and end times"""
        import system
        from java.util import Calendar

        now = system.date.now()
        cal = Calendar.getInstance()
        cal.setTime(now)

        hour = cal.get(Calendar.HOUR_OF_DAY)

        # Define shifts
        shifts = {
            "morning": (6, 14),
            "evening": (14, 22),
            "night": (22, 6)
        }

        # Determine current shift
        if 6 <= hour < 14:
            shift = "morning"
            start = system.date.setTime(now, 6, 0, 0)
            end = system.date.setTime(now, 14, 0, 0)
        elif 14 <= hour < 22:
            shift = "evening"
            start = system.date.setTime(now, 14, 0, 0)
            end = system.date.setTime(now, 22, 0, 0)
        else:
            shift = "night"
            if hour >= 22:
                start = system.date.setTime(now, 22, 0, 0)
                end = system.date.setTime(system.date.addDays(now, 1), 6, 0, 0)
            else:
                start = system.date.setTime(system.date.addDays(now, -1), 22, 0, 0)
                end = system.date.setTime(now, 6, 0, 0)

        return {
            "shift": shift,
            "start": start,
            "end": end
        }

    def format_duration(seconds):
        """Format seconds into readable duration"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs}s"

    return {
        "get_shift": get_shift_times,
        "format_duration": format_duration
    }
```

## Import Script Library Module

```python
def import_script_module():
    """Import a script library module dynamically"""

    # In Ignition scripts, import shared library modules
    import shared

    # Access specific module functions
    db_utils = shared.database.utils
    tag_ops = shared.tags.operations
    alarm_utils = shared.alarms.utilities

    # Use the imported functions
    result = db_utils.execute_query("SELECT * FROM production_data")
    tags = tag_ops.read_tags_safe(["[default]Machine/Status"])
    alarms = alarm_utils.get_active_alarms()

    return {
        "database": db_utils,
        "tags": tag_ops,
        "alarms": alarm_utils
    }
```

## Documentation Links
- [Script Library](https://docs.inductiveautomation.com/docs/8.3/scripting/script-library)
- [Shared Scripts](https://docs.inductiveautomation.com/docs/8.3/scripting/shared-scripts)