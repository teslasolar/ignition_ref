# Allen-Bradley Driver Configuration

## Driver Parameters

```params
driver_type: Allen-Bradley
protocols: EtherNet/IP,ControlNet,DH+
models: ControlLogix,CompactLogix,MicroLogix,PLC-5,SLC-500
port: 44818
slot: 0
timeout: 5000
```

## Allen-Bradley Driver Overview

Ignition provides native drivers for Allen-Bradley/Rockwell Automation PLCs, supporting the entire range from legacy PLC-5 to modern ControlLogix systems.

## Check Allen-Bradley Drivers

```python
#!/usr/bin/env python
import os
import socket

def check_ab_drivers():
    """Check Allen-Bradley driver installation and connections"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

    print("=== Allen-Bradley Driver Status ===\n")

    # Check driver modules
    modules_dir = os.path.join(ignition_root, "data", "modules")
    if os.path.exists(modules_dir):
        ab_drivers = [
            "allen-bradley-drivers.modl",
            "logix-driver.modl",
            "slc-driver.modl"
        ]

        for driver in ab_drivers:
            driver_path = os.path.join(modules_dir, driver)
            if os.path.exists(driver_path):
                print(f"[OK] {driver} installed")
            else:
                print(f"[!] {driver} not found")

    # Check EtherNet/IP port
    eip_port = 44818
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.bind(('', eip_port))
        sock.close()
        print(f"[OK] EtherNet/IP port {eip_port} available")
    except:
        print(f"[!] EtherNet/IP port {eip_port} may be in use")

    # List configured devices (simulated)
    configured_devices = [
        {"name": "CLX_Line1", "type": "ControlLogix", "ip": "192.168.1.100"},
        {"name": "CompactLogix_1", "type": "CompactLogix", "ip": "192.168.1.101"},
        {"name": "MicroLogix_1", "type": "MicroLogix 1400", "ip": "192.168.1.102"}
    ]

    print("\n=== Configured AB Devices ===")
    for device in configured_devices:
        print(f"  {device['name']}: {device['type']} @ {device['ip']}")

    return True

if __name__ == "__main__":
    check_ab_drivers()
```

## ControlLogix/CompactLogix Configuration

```python
def configure_logix_driver():
    """Configure ControlLogix/CompactLogix driver"""

    logix_config = {
        "device_name": "MainPLC_ControlLogix",
        "driver": "Logix Driver",
        "description": "Main production line ControlLogix",
        "enabled": True,
        "connection": {
            "hostname": "192.168.1.100",
            "port": 44818,  # EtherNet/IP
            "slot": 0,      # CPU slot number
            "timeout": 5000,  # ms
            "connection_path": ""  # Empty for direct connection
        },
        "communication": {
            "cip_connection_size": 4000,  # bytes
            "concurrent_requests": 2,
            "request_optimization": "Enabled"
        },
        "browse_settings": {
            "browse_enabled": True,
            "import_udt_enabled": True,
            "read_descriptions": True
        },
        "advanced": {
            "connection_timeout": 10000,  # ms
            "request_timeout": 5000,  # ms
            "pending_request_limit": 10,
            "auto_rebrowse": False
        }
    }

    # Connection path examples
    connection_paths = {
        "Direct": "",
        "Through_ENBT": "1,0",  # Through ENBT card in slot 1
        "Through_EN2T": "1,2,2,192.168.1.200,1,0",  # Through EN2T to another PLC
        "ControlNet": "2,0",  # Through ControlNet in slot 2
        "DH+": "3,0,5"  # Through DH+ in slot 3, node 5
    }

    return {
        "config": logix_config,
        "paths": connection_paths
    }
```

## Tag Addressing Syntax

```python
def allen_bradley_tag_syntax():
    """Allen-Bradley tag addressing syntax"""

    tag_syntax = {
        "Controller Tags": {
            "Atomic": {
                "BOOL": "MyBoolTag",
                "DINT": "MyDintTag",
                "REAL": "MyRealTag",
                "STRING": "MyStringTag"
            },
            "Arrays": {
                "Single": "MyArray[5]",
                "Multi": "MyArray[2,3]",
                "Range": "MyArray[0:9]"  # Read 10 elements
            },
            "UDTs": {
                "Member": "MyUDT.Member",
                "Nested": "MyUDT.SubUDT.Member",
                "Array": "MyUDTArray[5].Member"
            }
        },
        "Program Tags": {
            "Syntax": "Program:ProgramName.TagName",
            "Examples": {
                "Main": "Program:MainProgram.RunStatus",
                "Routine": "Program:Cell1.Motor1Speed"
            }
        },
        "Special Addressing": {
            "Bit_of_Word": "MyDINT.5",  # Bit 5 of DINT
            "String_Length": "MyString.LEN",
            "String_Data": "MyString.DATA[0]"
        },
        "System Tags": {
            "Controller": {
                "Faulted": "Controller.IsFaulted",
                "Mode": "Controller.Mode",
                "Time": "Controller.LocalDateTime"
            },
            "Module": {
                "Status": "Local:1:I.Fault",
                "Data": "Local:2:I.Data[0]"
            }
        }
    }

    # Optimization tips
    optimization = {
        "use_arrays": "Read entire arrays instead of individual elements",
        "group_tags": "Group related tags in UDTs",
        "minimize_strings": "Strings require more overhead",
        "use_aliases": "Create aliases for complex paths"
    }

    return {
        "syntax": tag_syntax,
        "optimization": optimization
    }
```

## MicroLogix/SLC-500 Configuration

```python
def configure_micrologix():
    """Configure MicroLogix/SLC-500 driver"""

    micrologix_config = {
        "device_name": "MicroLogix_1400",
        "driver": "MicroLogix",
        "connection": {
            "hostname": "192.168.1.110",
            "port": 44818,
            "timeout": 3000
        },
        "browse_settings": {
            "import_tag_database": True,
            "zero_based_addressing": False
        }
    }

    # SLC/MicroLogix file addressing
    file_addressing = {
        "Output": "O:0/0",          # Output file
        "Input": "I:1/0",           # Input file
        "Status": "S:0/0",          # Status file
        "Binary": "B3:0/0",         # Binary file
        "Timer": "T4:0.ACC",        # Timer accumulator
        "Counter": "C5:0.ACC",      # Counter accumulator
        "Control": "R6:0.POS",      # Control position
        "Integer": "N7:0",          # Integer file
        "Float": "F8:0",            # Float file
        "String": "ST9:0",          # String file (MicroLogix only)
        "Long": "L10:0"             # Long integer (MicroLogix only)
    }

    # Element access
    element_syntax = {
        "Bit": "B3:0/5",           # Bit 5 of word 0
        "Word": "N7:10",           # Word 10 in integer file
        "Timer_Preset": "T4:0.PRE", # Timer preset value
        "Timer_Done": "T4:0.DN",    # Timer done bit
        "Counter_Preset": "C5:0.PRE",
        "Counter_Done": "C5:0.DN"
    }

    return {
        "config": micrologix_config,
        "addressing": file_addressing,
        "elements": element_syntax
    }
```

## PLC-5 Configuration

```python
def configure_plc5():
    """Configure PLC-5 driver"""

    plc5_config = {
        "device_name": "PLC5_40E",
        "driver": "PLC5",
        "connection_type": "Ethernet",  # or "DH+", "ControlNet"
        "ethernet_settings": {
            "hostname": "192.168.1.120",
            "port": 2222,
            "half_duplex": False
        },
        "dh_plus_settings": {
            "card_type": "1784-PKTX",
            "node_address": 5,
            "routing_path": "1,0,2,5"
        }
    }

    # PLC-5 addressing
    plc5_addressing = {
        "Data_Files": {
            "Output": "O:000/00",
            "Input": "I:001/00",
            "Status": "S2:0",
            "Binary": "B3:0/0",
            "Timer": "T4:0",
            "Counter": "C5:0",
            "Control": "R6:0",
            "Integer": "N7:0",
            "Float": "F8:0",
            "ASCII": "A9:0",
            "BCD": "D10:0"
        },
        "Extended_Files": {
            "Binary": "B10:0/0",  # Files 10-999
            "Integer": "N100:0",
            "Float": "F200:0"
        },
        "Indirect_Addressing": {
            "Indexed": "N7:[N10:0]",  # N10:0 contains index
            "Computed": "#N[N7:0]:5"  # Computed file number
        }
    }

    return {
        "config": plc5_config,
        "addressing": plc5_addressing
    }
```

## Performance Optimization

```python
def optimize_ab_communication():
    """Optimize Allen-Bradley communication performance"""

    optimization_settings = {
        "Request Optimization": {
            "description": "Combine multiple tag reads into single request",
            "setting": "Enabled",
            "benefit": "Reduces communication overhead"
        },
        "CIP Connection Size": {
            "small_plc": 500,      # bytes - MicroLogix
            "medium_plc": 2000,    # bytes - CompactLogix
            "large_plc": 4000,     # bytes - ControlLogix
            "formula": "Adjust based on tag count and update rate"
        },
        "Concurrent Requests": {
            "recommended": 2,
            "maximum": 10,
            "consideration": "Higher values may overwhelm smaller PLCs"
        },
        "Scan Class Optimization": {
            "critical": 100,    # ms - Alarms, interlocks
            "fast": 500,       # ms - HMI displays
            "normal": 1000,    # ms - General monitoring
            "slow": 5000      # ms - Reporting data
        }
    }

    # Tag organization best practices
    best_practices = '''
# Best Practices for AB Tag Organization

1. Use UDTs in PLC:
   - Create UDTs for equipment (Motor, Valve, etc.)
   - Reduces communication overhead
   - Simplifies tag browsing

2. Array Optimization:
   - Read entire arrays vs individual elements
   - Example: Read MyArray[0:99] instead of 100 separate reads

3. Program Organization:
   - Group related tags in programs
   - Use consistent naming conventions
   - Minimize program-scoped tags

4. Data Type Selection:
   - Use appropriate data types (BOOL vs DINT for bits)
   - Minimize STRING usage (high overhead)
   - Pack BOOLs into DINT arrays when possible

5. Communication Path:
   - Use direct connection when possible
   - Minimize routing through multiple modules
   - Consider dedicated EtherNet/IP card for SCADA
    '''

    return {
        "settings": optimization_settings,
        "practices": best_practices
    }
```

## Troubleshooting

```python
def troubleshoot_ab_connection():
    """Troubleshoot Allen-Bradley connection issues"""

    common_issues = {
        "Connection Timeout": {
            "symptoms": ["Device shows disconnected", "Timeout errors in logs"],
            "causes": [
                "Incorrect IP address",
                "Firewall blocking port 44818",
                "PLC in program mode"
            ],
            "solutions": [
                "Verify IP and ping PLC",
                "Check firewall rules",
                "Ensure PLC is in Run mode"
            ]
        },
        "Bad Quality Tags": {
            "symptoms": ["Tags show bad quality", "Stale values"],
            "causes": [
                "Tag doesn't exist in PLC",
                "Incorrect addressing syntax",
                "Program-scoped tag without program prefix"
            ],
            "solutions": [
                "Verify tag exists using RSLogix",
                "Check tag path syntax",
                "Add Program: prefix for program tags"
            ]
        },
        "Slow Performance": {
            "symptoms": ["Slow tag updates", "High CPU usage"],
            "causes": [
                "Too many concurrent requests",
                "Small CIP connection size",
                "Reading individual array elements"
            ],
            "solutions": [
                "Reduce concurrent requests",
                "Increase CIP connection size",
                "Read arrays in blocks"
            ]
        },
        "Browse Failures": {
            "symptoms": ["Can't browse PLC tags", "Empty tag list"],
            "causes": [
                "Browse disabled in driver",
                "Insufficient privileges",
                "PLC project not downloaded"
            ],
            "solutions": [
                "Enable browsing in device config",
                "Check PLC security settings",
                "Ensure PLC has valid project"
            ]
        }
    }

    # Diagnostic script
    diagnostic_script = '''
import system

def diagnose_ab_device(deviceName):
    """Run diagnostics on AB device"""

    print(f"Diagnosing device: {deviceName}")

    # Check device status
    status = system.device.getDeviceStatus(deviceName)
    print(f"  Status: {status}")

    # Check connection
    if status == "Connected":
        # Test read
        testTag = f"[{deviceName}]Controller.Mode"
        value = system.tag.read(testTag)
        print(f"  Controller Mode: {value.value}")
        print(f"  Quality: {value.quality}")

        # Get metrics
        metrics = system.device.getDeviceMetrics(deviceName)
        print(f"  Request Count: {metrics.requestCount}")
        print(f"  Error Count: {metrics.errorCount}")
        print(f"  Throughput: {metrics.throughput} tags/sec")
    else:
        print("  Device not connected - check configuration")

    return status
    '''

    return {
        "issues": common_issues,
        "diagnostic": diagnostic_script
    }
```

## Import PLC Tags

```python
def import_plc_tags():
    """Import tags from Allen-Bradley PLC"""

    import_script = '''
import system

def import_from_plc(deviceName, tagProvider="default"):
    """Import UDTs and tags from PLC"""

    # Browse PLC tags
    browse_config = {
        "device": deviceName,
        "folderPath": "",
        "recursive": True
    }

    tags = system.device.browse(browse_config)

    # Create UDT definitions from PLC UDTs
    udts_created = []
    for tag in tags:
        if tag.type == "UDT_DEFINITION":
            udt_def = create_ignition_udt(tag)
            system.tag.addUDT(tagProvider, udt_def)
            udts_created.append(tag.name)

    print(f"Created {len(udts_created)} UDT definitions")

    # Import controller tags
    controller_tags = []
    for tag in tags:
        if tag.scope == "Controller":
            tag_config = {
                "name": tag.name,
                "path": f"[{tagProvider}]Imported/{tag.name}",
                "opcItemPath": f"[{deviceName}]{tag.plcPath}",
                "dataType": map_plc_datatype(tag.dataType),
                "opcServer": "Ignition OPC UA Server"
            }
            controller_tags.append(tag_config)

    # Create tags in Ignition
    system.tag.configure(
        tagProvider,
        controller_tags,
        "o"  # Overwrite
    )

    print(f"Imported {len(controller_tags)} tags")
    return controller_tags

def map_plc_datatype(plcType):
    """Map PLC data type to Ignition"""
    mapping = {
        "BOOL": "Boolean",
        "DINT": "Int4",
        "INT": "Int2",
        "SINT": "Int1",
        "REAL": "Float4",
        "STRING": "String"
    }
    return mapping.get(plcType, "Int4")
    '''

    return import_script
```

## Documentation Links
- [Allen-Bradley Drivers](https://docs.inductiveautomation.com/docs/8.3/allen-bradley-drivers)
- [Logix Driver Guide](https://docs.inductiveautomation.com/docs/8.3/logix-driver)
- [MicroLogix Driver](https://docs.inductiveautomation.com/docs/8.3/micrologix-driver)