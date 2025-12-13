# Tag Providers and UDT Configuration

## Tag Provider Parameters

```params
default_provider: default
tag_path: C:\Program Files\Inductive Automation\Ignition\data\projects
scan_class: Default
history_provider: DatabaseHistoryProvider
realtime_provider: default
```

## Check Tag Providers

```python
#!/usr/bin/env python
import os
import json
import sqlite3

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

def check_tag_providers():
    """Check configured tag providers"""
    print("=== Tag Provider Check ===\n")

    # Check default tag provider
    tag_config = os.path.join(ignition_root, "data", "config", "ignition", "tags")
    if os.path.exists(tag_config):
        print("✓ Tag configuration found")
        subdirs = os.listdir(tag_config)
        print(f"  Providers: {subdirs}")
    else:
        print("! Tag configuration directory not found")

    # Standard tag providers
    providers = {
        "[System]": "System tags (read-only)",
        "[default]": "Default tag provider",
        "[edge]": "Edge gateway provider (if configured)"
    }

    print("\n=== Standard Providers ===")
    for provider, description in providers.items():
        print(f"  {provider}: {description}")

def analyze_tag_structure():
    """Analyze tag folder structure"""
    print("\n=== Tag Organization ===")

    structure = {
        "Site": {
            "Area1": {
                "Equipment1": ["Tag1", "Tag2", "Tag3"],
                "Equipment2": ["Tag1", "Tag2", "Tag3"]
            },
            "Area2": {
                "Equipment3": ["Tag1", "Tag2", "Tag3"]
            }
        }
    }

    def print_structure(obj, indent=0):
        if isinstance(obj, dict):
            for key, value in obj.items():
                print("  " * indent + f"📁 {key}")
                print_structure(value, indent + 1)
        elif isinstance(obj, list):
            for item in obj:
                print("  " * indent + f"🏷️ {item}")

    print_structure(structure)

if __name__ == "__main__":
    check_tag_providers()
    analyze_tag_structure()
```

## UDT (User Defined Types) Configuration

### Create UDT Definition

```python
def create_motor_udt():
    """Create a motor UDT definition"""
    motor_udt = {
        "name": "Motor",
        "typeId": "Motor_Type_v1",
        "tagType": "UdtType",
        "tags": [
            {
                "name": "Running",
                "dataType": "Boolean",
                "opc": {
                    "server": "Ignition OPC UA Server",
                    "itemPath": "{InstanceName}/Running"
                }
            },
            {
                "name": "Speed",
                "dataType": "Float4",
                "engUnit": "RPM",
                "engLow": 0,
                "engHigh": 3600,
                "opc": {
                    "itemPath": "{InstanceName}/Speed"
                }
            },
            {
                "name": "Current",
                "dataType": "Float4",
                "engUnit": "Amps",
                "history": {
                    "enabled": True,
                    "sampleMode": "OnChange",
                    "maxAge": 30,
                    "maxAgeUnits": "Days"
                }
            },
            {
                "name": "Alarms",
                "tagType": "Folder",
                "tags": [
                    {
                        "name": "HighCurrent",
                        "dataType": "Float4",
                        "value": 100,
                        "alarms": [{
                            "name": "HighCurrent",
                            "mode": "AboveValue",
                            "setpoint": "{[.]HighCurrent}",
                            "priority": "High"
                        }]
                    }
                ]
            },
            {
                "name": "Control",
                "tagType": "Folder",
                "tags": [
                    {
                        "name": "Start",
                        "dataType": "Boolean",
                        "readOnly": False
                    },
                    {
                        "name": "Stop",
                        "dataType": "Boolean",
                        "readOnly": False
                    }
                ]
            }
        ],
        "parameters": [
            {
                "name": "InstanceName",
                "dataType": "String",
                "value": "Motor1"
            },
            {
                "name": "RatedCurrent",
                "dataType": "Float4",
                "value": 100.0
            }
        ]
    }

    print("Motor UDT Definition Created:")
    print(f"  Tags: {len(motor_udt['tags'])}")
    print(f"  Parameters: {len(motor_udt['parameters'])}")

    return motor_udt

create_motor_udt()
```

### Create UDT Instance

```python
def create_udt_instance():
    """Create an instance of a UDT"""
    instance = {
        "name": "Pump_Motor_01",
        "typeId": "Motor_Type_v1",
        "tagType": "UdtInstance",
        "parameters": {
            "InstanceName": "Area1/Pump01",
            "RatedCurrent": 85.5
        },
        "overrides": {
            "Alarms/HighCurrent": {
                "value": 90.0
            }
        }
    }

    print("UDT Instance Configuration:")
    print(json.dumps(instance, indent=2))
    return instance
```

## Tag Groups and Scan Classes

```python
def configure_tag_groups():
    """Configure tag groups for different scan rates"""
    tag_groups = {
        "Default": {
            "rate": 1000,  # ms
            "mode": "Direct",
            "readAfterWrite": True
        },
        "Fast": {
            "rate": 100,  # ms
            "mode": "Direct",
            "readAfterWrite": True
        },
        "Slow": {
            "rate": 10000,  # ms
            "mode": "Direct",
            "readAfterWrite": False
        },
        "Leased": {
            "rate": 1000,  # ms
            "mode": "Leased",
            "leasedRate": 100,  # ms when active
            "leaseTimeout": 30000  # ms
        },
        "Driven": {
            "mode": "Driven",
            "drivingTag": "[System]Gateway/Clock/Second",
            "compareValue": 0,
            "comparisonMode": "Equal"
        }
    }

    print("=== Tag Group Configuration ===\n")
    for name, config in tag_groups.items():
        print(f"{name} Group:")
        for key, value in config.items():
            print(f"  {key}: {value}")
        print()

    return tag_groups

configure_tag_groups()
```

## Tag Security

```python
def configure_tag_security():
    """Configure tag security policies"""
    security = {
        "readPermissions": {
            "policy": "Authenticated",
            "roles": ["Operator", "Engineer", "Administrator"]
        },
        "writePermissions": {
            "policy": "RequireAll",
            "roles": ["Engineer", "Administrator"]
        },
        "customPermissions": {
            "Control": {
                "policy": "RequireAny",
                "roles": ["Operator", "Engineer"]
            },
            "Configuration": {
                "policy": "RequireAll",
                "roles": ["Administrator"]
            }
        }
    }

    print("Tag Security Configuration:")
    print(json.dumps(security, indent=2))
    return security
```

## Tag Scripting

```python
def create_tag_scripts():
    """Create tag event scripts"""
    scripts = {
        "valueChanged": '''
def valueChanged(tag, tagPath, previousValue, currentValue, initialChange, missedEvents):
    """Triggered when tag value changes"""
    if not initialChange:
        system.util.getLogger("TagChange").info(
            "Tag %s changed from %s to %s" % (tagPath, previousValue, currentValue)
        )

        # Check for alarm condition
        if currentValue > 100:
            system.tag.writeBlocking(["[.]Alarms/HighValue"], [True])
''',
        "alarmActive": '''
def alarmActive(tag, tagPath, alarmName):
    """Triggered when alarm becomes active"""
    # Log alarm activation
    logger = system.util.getLogger("Alarms")
    logger.warn("Alarm %s active on tag %s" % (alarmName, tagPath))

    # Send notification
    system.alarm.queryStatus(
        path=[tagPath],
        state=["ActiveUnacked"]
    )
''',
        "qualityChanged": '''
def qualityChanged(tag, tagPath, previousQuality, currentQuality):
    """Triggered when tag quality changes"""
    if currentQuality.isNotGood():
        system.util.getLogger("TagQuality").warn(
            "Tag %s quality degraded to %s" % (tagPath, currentQuality)
        )
'''
    }

    print("Tag Event Scripts Defined:")
    for event in scripts.keys():
        print(f"  - {event}")

    return scripts
```

## Tag History Configuration

```python
def configure_tag_history():
    """Configure tag history settings"""
    history_config = {
        "provider": "DatabaseHistoryProvider",
        "storeAndForward": True,
        "sampleMode": "OnChange",
        "maxTimeBetweenSamples": 60,  # seconds
        "deadband": 1.0,
        "deadbandMode": "Absolute",
        "timestampSource": "System",
        "enabled": True,
        "storage": {
            "database": "default",
            "tableName": "sqlt_data_{tableYear}_{tableMonth}",
            "partitioning": "Monthly",
            "pruning": {
                "enabled": True,
                "ageLimit": 365,  # days
                "sizeLimitMB": 10000
            }
        }
    }

    print("Tag History Configuration:")
    print(json.dumps(history_config, indent=2))
    return history_config
```

## Tag Quality Codes

```python
def get_quality_codes():
    """Get tag quality code definitions"""
    quality_codes = {
        "Good": {
            "code": 192,
            "description": "Good quality data"
        },
        "Good_Provisional": {
            "code": 200,
            "description": "Good but provisional (not final)"
        },
        "Uncertain": {
            "code": 64,
            "description": "Uncertain quality"
        },
        "Bad": {
            "code": 0,
            "description": "Bad quality data"
        },
        "Bad_Stale": {
            "code": 24,
            "description": "Value is stale"
        },
        "Bad_Disabled": {
            "code": 25,
            "description": "Tag is disabled"
        },
        "Bad_NotConnected": {
            "code": 4,
            "description": "Not connected to source"
        },
        "Bad_ConfigurationError": {
            "code": 2,
            "description": "Configuration error"
        }
    }

    print("=== Tag Quality Codes ===\n")
    for name, info in quality_codes.items():
        print(f"{name} ({info['code']})")
        print(f"  {info['description']}")
        print()

    return quality_codes

get_quality_codes()
```

## Tag Import/Export

```python
def export_tags():
    """Export tag configuration"""
    export_config = {
        "format": "JSON",
        "path": "[default]Site/Area1",
        "recursive": True,
        "includeUDTs": True,
        "includeHistory": True,
        "includeAlarms": True,
        "includeScripts": True
    }

    print("Tag Export Configuration:")
    for key, value in export_config.items():
        print(f"  {key}: {value}")

    # Sample export structure
    export_data = {
        "version": "8.3.0",
        "tagProvider": "default",
        "tags": [
            {
                "path": "Site/Area1/Motor1",
                "type": "UdtInstance",
                "typeId": "Motor_Type_v1",
                "parameters": {
                    "InstanceName": "Motor1"
                }
            }
        ]
    }

    return export_data
```

## Documentation Links
- [Tag Providers](https://docs.inductiveautomation.com/docs/8.3/tag-configuration/tag-providers)
- [User Defined Types](https://docs.inductiveautomation.com/docs/8.3/tag-configuration/user-defined-types)
- [Tag Groups](https://docs.inductiveautomation.com/docs/8.3/tag-configuration/tag-groups)
- [Tag History](https://docs.inductiveautomation.com/docs/8.3/tag-historian)