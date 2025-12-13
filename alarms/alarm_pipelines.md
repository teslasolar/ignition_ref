# Alarm Pipelines and Notification Configuration

## Alarm Parameters

```params
alarm_db: C:\Program Files\Inductive Automation\Ignition\data\db\config.idb
pipeline_config: data\alarm-notification\pipelines
notification_profiles: data\alarm-notification\profiles
journal_name: AlarmJournal
active_pipeline: true
```

## Check Alarm Configuration

```python
#!/usr/bin/env python
import sqlite3
import os
import json

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

def check_alarm_config():
    """Check alarm pipelines and notification profiles"""
    print("=== Alarm System Check ===\n")

    # Check alarm configuration in database
    config_db = os.path.join(ignition_root, "data", "db", "config.idb")

    if os.path.exists(config_db):
        try:
            conn = sqlite3.connect(config_db)
            cursor = conn.cursor()

            # Check for alarm pipelines
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%alarm%'")
            tables = cursor.fetchall()

            if tables:
                print(f"✓ Alarm tables found: {len(tables)}")
                for table in tables:
                    print(f"  - {table[0]}")
            else:
                print("! No alarm tables found")

            conn.close()
        except Exception as e:
            print(f"Error checking database: {e}")
    else:
        print("✗ Configuration database not found")

    # Check alarm notification directory
    alarm_dir = os.path.join(ignition_root, "data", "alarm-notification")
    if os.path.exists(alarm_dir):
        print(f"✓ Alarm notification directory exists")

        # Check for pipelines
        pipeline_dir = os.path.join(alarm_dir, "pipelines")
        if os.path.exists(pipeline_dir):
            pipelines = os.listdir(pipeline_dir)
            print(f"  Pipelines: {len(pipelines)}")

        # Check for profiles
        profile_dir = os.path.join(alarm_dir, "profiles")
        if os.path.exists(profile_dir):
            profiles = os.listdir(profile_dir)
            print(f"  Notification profiles: {len(profiles)}")
    else:
        print("! Alarm notification not configured")

def analyze_alarm_states():
    """Analyze alarm state distribution"""
    print("\n=== Alarm States ===")

    alarm_states = {
        "Clear": "Normal state, no alarm",
        "Active": "Alarm condition present",
        "Acknowledged": "Operator acknowledged",
        "Cleared_Unacknowledged": "Condition cleared, needs ack"
    }

    for state, desc in alarm_states.items():
        print(f"  {state}: {desc}")

def check_notification_profiles():
    """Check notification profile types"""
    print("\n=== Notification Types ===")

    profiles = {
        "Email": "SMTP email notifications",
        "SMS": "Text message via gateway",
        "Voice": "Voice call notifications",
        "Roster": "On-call roster management"
    }

    for profile_type, desc in profiles.items():
        print(f"  {profile_type}: {desc}")

if __name__ == "__main__":
    check_alarm_config()
    analyze_alarm_states()
    check_notification_profiles()
```

## Alarm Pipeline Structure

### Pipeline Components
```python
def create_pipeline_template():
    """Create alarm pipeline template"""
    pipeline = {
        "name": "Critical_Alarms",
        "enabled": True,
        "blocks": [
            {
                "type": "Switch",
                "property": "Priority",
                "cases": {
                    "Critical": "email_immediately",
                    "High": "email_delay_5min",
                    "Medium": "email_delay_15min",
                    "Low": "log_only"
                }
            },
            {
                "type": "Notification",
                "id": "email_immediately",
                "profile": "EmailProfile",
                "consolidation": False
            },
            {
                "type": "Delay",
                "id": "email_delay_5min",
                "delay": 300,
                "next": "email_notification"
            }
        ]
    }

    print("Pipeline Template:")
    print(json.dumps(pipeline, indent=2))
    return pipeline
```

## Alarm Properties

### Standard Alarm Properties
| Property | Type | Description |
|----------|------|-------------|
| **Name** | String | Unique alarm identifier |
| **Display Path** | String | Hierarchical display path |
| **Priority** | Integer | 0 (Diagnostic) to 4 (Critical) |
| **Enabled** | Boolean | Alarm enabled state |
| **Mode** | Enum | Equal, Above, Below, Between, etc. |
| **Setpoint** | Numeric | Alarm trigger value |
| **Deadband** | Numeric | Hysteresis value |
| **Time Delay** | Integer | Delay before activation (seconds) |

### Associated Data
```python
def get_alarm_associated_data():
    """Define associated data for alarms"""
    associated_data = {
        "Equipment": "{Equipment_Name}",
        "Area": "{Area_Code}",
        "Operator": "{Current_Operator}",
        "SetpointSource": "{Tag_Path}",
        "Documentation": "http://docs/alarm/{Name}"
    }

    return associated_data
```

## Notification Profile Configuration

### Email Profile
```python
def configure_email_profile():
    """Email notification profile configuration"""
    profile = {
        "name": "Plant_Email",
        "type": "email",
        "settings": {
            "smtp_host": "mail.company.com",
            "smtp_port": 587,
            "use_tls": True,
            "username": "ignition@company.com",
            "from_address": "ignition@company.com"
        },
        "subject_template": "Alarm: ${name} - ${priority}",
        "body_template": """
        Alarm Notification
        ==================
        Alarm: ${displayPath}
        Priority: ${priority}
        State: ${eventState}
        Value: ${eventValue}
        Time: ${eventTime}

        Message: ${label}
        Notes: ${notes}
        """
    }

    return profile
```

### SMS Profile
```python
def configure_sms_profile():
    """SMS notification profile configuration"""
    profile = {
        "name": "Plant_SMS",
        "type": "sms",
        "settings": {
            "gateway_type": "Twilio",
            "account_sid": "YOUR_ACCOUNT_SID",
            "auth_token": "YOUR_AUTH_TOKEN",
            "from_number": "+1234567890"
        },
        "message_template": "${name}: ${eventState} at ${eventTime}"
    }

    return profile
```

## Alarm Journal Configuration

### Journal Settings
```python
def check_alarm_journal():
    """Check alarm journal configuration"""
    journal_config = {
        "name": "AlarmJournal",
        "datasource": "default",
        "table_name": "alarm_events",
        "prune_enabled": True,
        "prune_age": 90,  # days
        "prune_age_units": "Days"
    }

    print("Alarm Journal Configuration:")
    for key, value in journal_config.items():
        print(f"  {key}: {value}")

    return journal_config
```

## Alarm Shelving

### Shelving Configuration
```python
def configure_shelving():
    """Configure alarm shelving policies"""
    shelving = {
        "enabled": True,
        "max_shelve_time": 24,  # hours
        "require_comment": True,
        "allowed_users": ["Operator", "Supervisor", "Manager"],
        "audit_shelving": True
    }

    print("Shelving Policy:")
    for key, value in shelving.items():
        print(f"  {key}: {value}")

    return shelving
```

## Roster Management

### On-Call Roster
```python
def create_roster():
    """Create on-call roster configuration"""
    roster = {
        "name": "Operations_Roster",
        "users": [
            {"name": "John", "phone": "555-0001", "email": "john@company.com"},
            {"name": "Jane", "phone": "555-0002", "email": "jane@company.com"}
        ],
        "schedule": {
            "type": "Weekly",
            "rotation": "Sequential",
            "start_time": "08:00",
            "duration": 168  # hours
        }
    }

    return roster
```

## Documentation Links
- [Alarm Configuration](https://docs.inductiveautomation.com/docs/8.3/alarming)
- [Alarm Pipelines](https://docs.inductiveautomation.com/docs/8.3/alarming/alarm-notification/alarm-pipelines)
- [Notification Profiles](https://docs.inductiveautomation.com/docs/8.3/alarming/alarm-notification/notification-profiles)