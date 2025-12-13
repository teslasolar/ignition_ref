# Sequential Function Charts (SFC) Module

## Module Parameters

```params
module: SFC
version: 8.3.0
execution_engine: Gateway
chart_types: Sequential,Parallel,Enclosing
storage: Database
isa_s88_compliant: true
```

## SFC Module Overview

The SFC module provides a graphical programming environment for creating sequential control logic, batch processes, and procedural automation following ISA-S88 standards.

## Check SFC Module Status

```python
#!/usr/bin/env python
import os
import json
import sqlite3

def check_sfc_module():
    """Check SFC module installation and running charts"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

    print("=== SFC Module Status ===\n")

    # Check module installation
    modules_dir = os.path.join(ignition_root, "data", "modules")
    if os.path.exists(modules_dir):
        sfc_modules = [f for f in os.listdir(modules_dir)
                      if 'sfc' in f.lower()]
        if sfc_modules:
            print(f"[OK] SFC module found: {sfc_modules}")
        else:
            print("[!] SFC module not installed")

    # Check for SFC definitions in projects
    projects_dir = os.path.join(ignition_root, "data", "projects")
    if os.path.exists(projects_dir):
        sfc_count = 0
        for project in os.listdir(projects_dir):
            sfc_path = os.path.join(projects_dir, project, "ignition", "sfc")
            if os.path.exists(sfc_path):
                charts = [f for f in os.listdir(sfc_path) if f.endswith('.xml')]
                if charts:
                    print(f"  Project '{project}': {len(charts)} charts")
                    sfc_count += len(charts)

        print(f"\nTotal SFC charts found: {sfc_count}")

    # Check running instances (from database)
    db_path = os.path.join(ignition_root, "data", "db", "config.idb")
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT COUNT(*) FROM sfc_instances WHERE status='Running'")
            running = cursor.fetchone()[0]
            print(f"Running SFC instances: {running}")
        except:
            pass
        conn.close()

    return True

if __name__ == "__main__":
    check_sfc_module()
```

## SFC Element Types

```python
def sfc_element_types():
    """Define SFC element types and their purposes"""

    elements = {
        "Steps": {
            "Action Step": {
                "purpose": "Execute actions (scripts, tag writes)",
                "icon": "rectangle",
                "color": "green"
            },
            "Transition": {
                "purpose": "Conditional logic between steps",
                "icon": "diamond",
                "color": "yellow"
            },
            "Enclosing Step": {
                "purpose": "Contains nested chart",
                "icon": "double-rectangle",
                "color": "blue"
            },
            "Parallel": {
                "purpose": "Execute multiple branches simultaneously",
                "icon": "horizontal-bar",
                "color": "purple"
            },
            "Jump": {
                "purpose": "Go to another step in chart",
                "icon": "arrow",
                "color": "gray"
            }
        },
        "Flow Control": {
            "Start": {
                "purpose": "Chart entry point",
                "required": True
            },
            "End": {
                "purpose": "Chart termination",
                "required": False
            },
            "OnStart": {
                "purpose": "Initialization script",
                "scope": "chart"
            },
            "OnStop": {
                "purpose": "Cleanup script",
                "scope": "chart"
            },
            "OnAbort": {
                "purpose": "Error handling",
                "scope": "chart"
            }
        }
    }

    print("=== SFC Elements ===")
    for category, items in elements.items():
        print(f"\n{category}:")
        for name, details in items.items():
            print(f"  {name}: {details['purpose']}")

    return elements
```

## SFC Chart Structure

```python
def create_batch_process_sfc():
    """Create a batch process SFC structure"""

    batch_sfc = {
        "name": "BatchMixingProcess",
        "description": "Automated batch mixing sequence",
        "parameters": {
            "RecipeID": {"type": "Integer", "default": 1},
            "BatchSize": {"type": "Float", "default": 100.0},
            "TargetTemp": {"type": "Float", "default": 75.0}
        },
        "steps": [
            {
                "id": "S1",
                "name": "Initialize",
                "type": "action",
                "onstart": '''
# Initialize batch
chartScope.batchID = system.date.now().time
chartScope.startTime = system.date.now()
system.tag.write("[default]Batch/ID", chartScope.batchID)
system.tag.write("[default]Batch/Status", "Initializing")
                '''
            },
            {
                "id": "T1",
                "name": "CheckReady",
                "type": "transition",
                "expression": '''
# Check if equipment is ready
tankEmpty = system.tag.read("[default]Tank/Level").value < 5
mixerReady = system.tag.read("[default]Mixer/Status").value == "Ready"
return tankEmpty and mixerReady
                '''
            },
            {
                "id": "S2",
                "name": "AddIngredients",
                "type": "parallel",
                "branches": [
                    {
                        "name": "AddWater",
                        "steps": [
                            {
                                "name": "OpenWaterValve",
                                "onstart": "system.tag.write('[default]Valves/Water', True)",
                                "onstop": "system.tag.write('[default]Valves/Water', False)"
                            },
                            {
                                "name": "WaitForLevel",
                                "transition": "system.tag.read('[default]Tank/Level').value >= chartScope.BatchSize * 0.6"
                            }
                        ]
                    },
                    {
                        "name": "AddChemical",
                        "steps": [
                            {
                                "name": "StartPump",
                                "onstart": "system.tag.write('[default]Pumps/Chemical', True)",
                                "onstop": "system.tag.write('[default]Pumps/Chemical', False)"
                            },
                            {
                                "name": "WaitForAmount",
                                "transition": "system.tag.read('[default]Chemical/TotalFlow').value >= chartScope.BatchSize * 0.4"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "S3",
                "name": "Mix",
                "type": "enclosing",
                "chart": "MixingSequence",
                "handoff": {
                    "TargetTemp": "chartScope.TargetTemp",
                    "MixTime": "300"  # 5 minutes
                }
            },
            {
                "id": "S4",
                "name": "QualityCheck",
                "type": "action",
                "onstart": '''
# Perform quality check
ph = system.tag.read("[default]Tank/pH").value
temp = system.tag.read("[default]Tank/Temperature").value
density = system.tag.read("[default]Tank/Density").value

chartScope.qualityPass = (6.5 <= ph <= 7.5) and \
                         (temp >= chartScope.TargetTemp - 2) and \
                         (density >= 1.0)

if not chartScope.qualityPass:
    chart.setVariable("needsAdjustment", True)
                '''
            },
            {
                "id": "T2",
                "name": "QualityDecision",
                "type": "transition",
                "expression": "return chartScope.qualityPass"
            },
            {
                "id": "S5",
                "name": "Transfer",
                "type": "action",
                "onstart": '''
system.tag.write("[default]Valves/Discharge", True)
system.tag.write("[default]Pumps/Transfer", True)
                ''',
                "onstop": '''
system.tag.write("[default]Valves/Discharge", False)
system.tag.write("[default]Pumps/Transfer", False)
                '''
            },
            {
                "id": "S6",
                "name": "Complete",
                "type": "action",
                "onstart": '''
# Log batch completion
endTime = system.date.now()
duration = system.date.secondsBetween(chartScope.startTime, endTime)

system.db.runNamedQuery("LogBatchComplete", {
    "batchID": chartScope.batchID,
    "recipe": chart.get("RecipeID"),
    "duration": duration,
    "quality": chartScope.qualityPass
})

system.tag.write("[default]Batch/Status", "Complete")
                '''
            }
        ]
    }

    print(f"Batch SFC Created: {batch_sfc['name']}")
    print(f"  Steps: {len(batch_sfc['steps'])}")
    print(f"  Parameters: {list(batch_sfc['parameters'].keys())}")

    return batch_sfc
```

## SFC Execution Control

```python
def sfc_execution_control():
    """SFC execution control and monitoring"""

    control_functions = '''
import system

def start_chart(chartPath, parameters={}):
    """Start a new SFC instance"""
    instanceId = system.sfc.startChart(
        chartPath,
        parameters
    )
    print(f"Started SFC instance: {instanceId}")
    return instanceId

def pause_chart(instanceId):
    """Pause a running SFC"""
    system.sfc.pauseChart(instanceId)
    print(f"Paused SFC: {instanceId}")

def resume_chart(instanceId):
    """Resume a paused SFC"""
    system.sfc.resumeChart(instanceId)
    print(f"Resumed SFC: {instanceId}")

def cancel_chart(instanceId):
    """Cancel/abort a running SFC"""
    system.sfc.cancelChart(instanceId)
    print(f"Cancelled SFC: {instanceId}")

def get_running_charts():
    """Get all running SFC instances"""
    instances = system.sfc.getRunningCharts()
    for instance in instances:
        print(f"Instance: {instance.id}")
        print(f"  Chart: {instance.chartPath}")
        print(f"  State: {instance.state}")
        print(f"  Current Step: {instance.currentStep}")
    return instances

def get_chart_status(instanceId):
    """Get detailed status of SFC instance"""
    status = system.sfc.getChartStatus(instanceId)
    return {
        "id": instanceId,
        "state": status.state,
        "currentStep": status.currentStep,
        "startTime": status.startTime,
        "variables": status.variables
    }

def set_chart_variable(instanceId, name, value):
    """Set a chart variable during execution"""
    system.sfc.setVariable(instanceId, name, value)
    print(f"Set {name}={value} for instance {instanceId}")
    '''

    monitoring_script = '''
def monitor_sfc_instance(instanceId):
    """Monitor SFC execution progress"""
    import system
    import time

    while True:
        status = system.sfc.getChartStatus(instanceId)

        if status.state == "Running":
            print(f"Step: {status.currentStep}")
            print(f"Time: {status.runningTime}s")

            # Check for errors
            if status.error:
                print(f"ERROR: {status.errorMessage}")
                break

        elif status.state == "Completed":
            print("SFC completed successfully")
            break

        elif status.state == "Cancelled":
            print("SFC was cancelled")
            break

        time.sleep(1)
    '''

    return {
        "control": control_functions,
        "monitoring": monitoring_script
    }
```

## ISA-88 Batch Implementation

```python
def isa88_batch_structure():
    """ISA-88 compliant batch structure"""

    s88_hierarchy = {
        "Procedure": {
            "description": "Top-level recipe procedure",
            "example": "Make_Product_A",
            "contains": ["Unit Procedures"]
        },
        "Unit Procedure": {
            "description": "Major processing activity",
            "example": "Reaction_Phase",
            "contains": ["Operations"]
        },
        "Operation": {
            "description": "Independent processing activity",
            "example": "Charge_Reactor",
            "contains": ["Phases"]
        },
        "Phase": {
            "description": "Smallest element of procedural control",
            "example": "Open_Valve",
            "contains": ["Actions"]
        }
    }

    # Example S88 Phase
    s88_phase = '''
def phase_charge_reactor(unit, material, amount):
    """ISA-88 Phase: Charge Reactor"""

    # Phase states
    IDLE = 0
    RUNNING = 1
    COMPLETE = 2
    HOLDING = 3
    RESTARTING = 4
    STOPPING = 5
    STOPPED = 6
    ABORTING = 7
    ABORTED = 8

    phase_state = IDLE

    try:
        # Start phase
        phase_state = RUNNING
        log_phase_transition("Charge_Reactor", "RUNNING")

        # Verify unit availability
        if not verify_unit_available(unit):
            raise Exception(f"Unit {unit} not available")

        # Open inlet valve
        system.tag.write(f"[default]{unit}/Valves/Inlet", True)

        # Start transfer
        system.tag.write(f"[default]{unit}/Pumps/Transfer", True)

        # Monitor amount
        total = 0
        while total < amount:
            current = system.tag.read(f"[default]{unit}/Flow/Total").value
            total = current

            # Check for hold condition
            if check_hold_condition():
                phase_state = HOLDING
                system.tag.write(f"[default]{unit}/Pumps/Transfer", False)
                wait_for_restart()
                phase_state = RESTARTING
                system.tag.write(f"[default]{unit}/Pumps/Transfer", True)

            system.util.sleep(100)

        # Complete transfer
        system.tag.write(f"[default]{unit}/Pumps/Transfer", False)
        system.tag.write(f"[default]{unit}/Valves/Inlet", False)

        phase_state = COMPLETE
        log_phase_transition("Charge_Reactor", "COMPLETE")

    except Exception as e:
        phase_state = ABORTING
        emergency_stop(unit)
        phase_state = ABORTED
        log_phase_transition("Charge_Reactor", "ABORTED", str(e))
        raise

    return phase_state
    '''

    return {
        "hierarchy": s88_hierarchy,
        "phase_example": s88_phase
    }
```

## SFC Error Handling

```python
def sfc_error_handling():
    """SFC error handling and recovery"""

    error_handlers = {
        "OnError": '''
def onError(chart, step, error):
    """Global error handler for SFC"""
    import system

    # Log error
    system.util.getLogger("SFC").error(
        f"Error in {chart.name} at step {step}: {error}"
    )

    # Store error context
    chart.errorStep = step
    chart.errorMessage = str(error)
    chart.errorTime = system.date.now()

    # Determine recovery action
    if "timeout" in str(error).lower():
        # Retry on timeout
        return "retry"
    elif "critical" in str(error).lower():
        # Abort on critical errors
        return "abort"
    else:
        # Pause for operator intervention
        return "pause"
        ''',
        "OnAbort": '''
def onAbort(chart):
    """Handle SFC abort"""
    import system

    # Safe shutdown sequence
    system.tag.write("[default]Process/EmergencyStop", True)

    # Close all valves
    valves = system.tag.browse("[default]Valves")
    for valve in valves:
        system.tag.write(valve.fullPath, False)

    # Stop all pumps
    pumps = system.tag.browse("[default]Pumps")
    for pump in pumps:
        system.tag.write(pump.fullPath, False)

    # Log abort
    system.db.runNamedQuery("LogSFCAbort", {
        "chartName": chart.name,
        "instanceId": chart.instanceId,
        "abortTime": system.date.now(),
        "reason": chart.errorMessage
    })

    # Notify operators
    system.util.sendMessage(
        "Operations",
        "SFCAborted",
        {"chart": chart.name, "error": chart.errorMessage}
    )
        ''',
        "Recovery": '''
def recover_from_error(instanceId, recoveryAction):
    """Recover from SFC error"""
    import system

    status = system.sfc.getChartStatus(instanceId)

    if recoveryAction == "retry":
        # Retry current step
        system.sfc.retryStep(instanceId)

    elif recoveryAction == "skip":
        # Skip to next step
        system.sfc.skipStep(instanceId)

    elif recoveryAction == "restart":
        # Restart from checkpoint
        checkpoint = status.variables.get("lastCheckpoint", "S1")
        system.sfc.jumpToStep(instanceId, checkpoint)

    elif recoveryAction == "manual":
        # Switch to manual mode
        system.sfc.pauseChart(instanceId)
        system.tag.write("[default]Process/Mode", "Manual")

    else:
        # Abort
        system.sfc.cancelChart(instanceId)
        '''
    }

    return error_handlers
```

## SFC Monitoring Dashboard

```python
def create_sfc_monitoring():
    """Create SFC monitoring dashboard components"""

    dashboard_queries = {
        "active_charts": '''
            SELECT
                instance_id,
                chart_name,
                start_time,
                current_step,
                status,
                TIMESTAMPDIFF(MINUTE, start_time, NOW()) as duration_min
            FROM sfc_instances
            WHERE status IN ('Running', 'Paused')
            ORDER BY start_time DESC
        ''',
        "chart_history": '''
            SELECT
                chart_name,
                COUNT(*) as executions,
                AVG(duration_seconds) as avg_duration,
                SUM(CASE WHEN status='Complete' THEN 1 ELSE 0 END) as successful,
                SUM(CASE WHEN status='Aborted' THEN 1 ELSE 0 END) as failed
            FROM sfc_history
            WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY chart_name
        ''',
        "step_performance": '''
            SELECT
                step_name,
                AVG(duration_seconds) as avg_duration,
                MAX(duration_seconds) as max_duration,
                COUNT(*) as executions
            FROM sfc_step_history
            WHERE chart_name = ?
            GROUP BY step_name
            ORDER BY avg_duration DESC
        '''
    }

    monitoring_tags = {
        "[System]SFC/ActiveCount": "Number of active SFC instances",
        "[System]SFC/TotalExecutions": "Total SFC executions today",
        "[System]SFC/SuccessRate": "Success rate percentage",
        "[System]SFC/AverageRuntime": "Average runtime in minutes"
    }

    return {
        "queries": dashboard_queries,
        "tags": monitoring_tags
    }
```

## Documentation Links
- [SFC Module Guide](https://docs.inductiveautomation.com/docs/8.3/sfc-module)
- [ISA-88 Batch Control](https://docs.inductiveautomation.com/docs/8.3/sfc-module/isa-88)
- [SFC Scripting Functions](https://docs.inductiveautomation.com/docs/8.3/scripting/sfc)