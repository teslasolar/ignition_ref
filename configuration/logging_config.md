# Logging Configuration Reference

## Logging Parameters

```params
logback_config: C:\Program Files\Inductive Automation\Ignition\data\logback.xml
wrapper_log: C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log
system_logs_db: C:\Program Files\Inductive Automation\Ignition\logs\system_logs.idb
max_log_files: 5
log_size_mb: 10
```

## Analyze Logs

```python
#!/usr/bin/env python
import os
import sqlite3
from datetime import datetime

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

def check_logs():
    """Analyze Ignition logs"""
    print("=== Ignition Log Analysis ===\n")

    # Check wrapper.log
    wrapper_log = os.path.join(ignition_root, "logs", "wrapper.log")
    if os.path.exists(wrapper_log):
        size_mb = os.path.getsize(wrapper_log) / (1024 * 1024)
        print(f"✓ Wrapper log: {size_mb:.2f} MB")

        # Count errors in last 100 lines
        with open(wrapper_log, 'r', errors='ignore') as f:
            lines = f.readlines()
            recent = lines[-100:] if len(lines) > 100 else lines
            errors = sum(1 for l in recent if 'ERROR' in l or 'Exception' in l)
            warnings = sum(1 for l in recent if 'WARN' in l)
            print(f"  Recent: {errors} errors, {warnings} warnings")
    else:
        print("✗ Wrapper log not found")

    # Check rotated logs
    log_dir = os.path.join(ignition_root, "logs")
    if os.path.exists(log_dir):
        rotated = [f for f in os.listdir(log_dir) if f.startswith("wrapper.log.")]
        if rotated:
            print(f"✓ Rotated logs: {len(rotated)} files")

    # Check system_logs.idb
    system_db = os.path.join(ignition_root, "logs", "system_logs.idb")
    if os.path.exists(system_db):
        size_mb = os.path.getsize(system_db) / (1024 * 1024)
        print(f"✓ System logs DB: {size_mb:.2f} MB")

        try:
            conn = sqlite3.connect(system_db)
            cursor = conn.cursor()

            # Count log entries by level
            cursor.execute("SELECT level, COUNT(*) FROM logevents GROUP BY level")
            levels = cursor.fetchall()

            print("  Log levels:")
            for level, count in levels:
                level_name = {10000: 'DEBUG', 20000: 'INFO',
                            30000: 'WARN', 40000: 'ERROR'}.get(level, str(level))
                print(f"    {level_name}: {count}")

            conn.close()
        except Exception as e:
            print(f"  Unable to query DB: {e}")
    else:
        print("✗ System logs database not found")

def get_recent_errors():
    """Get recent error messages"""
    wrapper_log = os.path.join(ignition_root, "logs", "wrapper.log")
    if os.path.exists(wrapper_log):
        print("\n=== Recent Errors ===")
        with open(wrapper_log, 'r', errors='ignore') as f:
            lines = f.readlines()
            errors = [l.strip() for l in lines[-500:] if 'ERROR' in l or 'Exception' in l]

            if errors:
                for error in errors[-5:]:  # Show last 5 errors
                    print(f"  {error[:100]}...")
            else:
                print("  No recent errors found")

if __name__ == "__main__":
    check_logs()
    get_recent_errors()
```

## Overview

Ignition 8.3.0 uses Logback as its logging framework with SQLite database storage for system logs.

---

## Log File Locations

### Primary Log Files

| Log Type | Location | Purpose | Format |
|----------|----------|---------|--------|
| **Wrapper Log** | `logs\wrapper.log` | Service and startup logs | Text |
| **System Logs DB** | `logs\system_logs.idb` | Gateway system events | SQLite |
| **Rotated Wrapper** | `logs\wrapper.log.1-5` | Historical wrapper logs | Text |
| **Installation** | `logs\install_*.log` | Install/upgrade logs | Text |

### Module-Specific Logs
Stored in `system_logs.idb` database with logger names:
- `opcua.server` - OPC UA module logs
- `perspective.gateway` - Perspective module logs
- `tags.provider` - Tag provider logs
- `database.connections` - Database connection logs

---

## Logback Configuration (logback.xml)

### Structure Overview
```xml
<configuration>
    <!-- Appenders define where logs go -->
    <appender name="SysoutAppender">...</appender>
    <appender name="DBAppender">...</appender>

    <!-- Loggers define what gets logged -->
    <logger name="org.apache.wicket" level="WARN"/>
    <logger name="com.inductiveautomation" level="DEBUG"/>

    <!-- Root logger -->
    <root level="INFO">
        <appender-ref ref="DBAppender"/>
    </root>
</configuration>
```

### Current Configuration Details

#### Console Appender
```xml
<appender name="SysoutAppender" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{HH:mm:ss.SSS} [%-5level] [%-30logger] %msg%n</pattern>
    </encoder>
</appender>
```

#### Database Appender
```xml
<appender name="DBAppender" class="com.inductiveautomation.logging.SQLiteAppender">
    <dir>logs</dir>
    <fileName>system_logs.idb</fileName>
    <maxEvents>50000</maxEvents>
    <maxEventsPerLogger>10000</maxEventsPerLogger>
    <levels>INFO,WARN,ERROR,FATAL</levels>
</appender>
```

---

## Log Levels

### Available Log Levels
| Level | Severity | Description | Use Case |
|-------|----------|-------------|----------|
| **TRACE** | Lowest | Most detailed information | Deep debugging |
| **DEBUG** | Low | Detailed debugging information | Development/troubleshooting |
| **INFO** | Normal | General information messages | Normal operation |
| **WARN** | Medium | Warning messages | Potential issues |
| **ERROR** | High | Error messages | Recoverable errors |
| **FATAL** | Highest | Fatal error messages | System failures |

### Default Logger Levels
```xml
<!-- Root level -->
<root level="INFO">

<!-- Specific loggers -->
<logger name="org.apache.wicket" level="WARN"/>
<logger name="org.eclipse.jetty" level="WARN"/>
<logger name="org.apache.commons" level="WARN"/>
<logger name="com.inductiveautomation" level="DEBUG"/>
```

---

## Wrapper Logging Configuration

### In ignition.conf
```properties
# Wrapper log configuration
wrapper.console.format=PM
wrapper.console.loglevel=INFO
wrapper.logfile=logs/wrapper.log
wrapper.logfile.format=LPTM
wrapper.logfile.loglevel=INFO
wrapper.logfile.maxsize=10m
wrapper.logfile.maxfiles=5
```

### Log Format Tokens
| Token | Meaning | Example |
|-------|---------|---------|
| **L** | Log level | INFO |
| **P** | PID | 1234 |
| **T** | Thread | main |
| **M** | Message | Gateway started |

### Rotation Settings
- **Max Size:** 10 MB per file
- **Max Files:** 5 rotated files
- **Total Max:** 50 MB wrapper logs

---

## Viewing Logs

### Gateway Web Interface
1. Navigate to: http://localhost:8088
2. Go to: Status → Diagnostics → Logs
3. Features:
   - Real-time log viewing
   - Filter by level
   - Search functionality
   - Export capabilities

### Direct Database Access
```sql
-- Connect to logs\system_logs.idb
-- View recent errors
SELECT * FROM logevents
WHERE level >= 40000
ORDER BY eventtime DESC
LIMIT 100;
```

### Wrapper Log Viewing
```batch
# View current log
type logs\wrapper.log

# View last 50 lines
powershell Get-Content logs\wrapper.log -Tail 50

# Monitor in real-time
powershell Get-Content logs\wrapper.log -Wait
```

---

## Common Logger Names

### System Loggers
| Logger Name | Purpose | Typical Level |
|-------------|---------|---------------|
| `gateway` | Main gateway operations | INFO |
| `gateway.tags` | Tag system | INFO |
| `gateway.database` | Database connections | INFO |
| `gateway.licensing` | License operations | INFO |
| `gateway.redundancy` | Redundancy operations | INFO |

### Module Loggers
| Logger Name | Module | Purpose |
|-------------|--------|---------|
| `perspective.gateway` | Perspective | Web HMI operations |
| `opcua.server` | OPC UA | OPC UA server |
| `alarm.notification` | Alarm | Alarm delivery |
| `reporting.gateway` | Reporting | Report generation |
| `sfc.gateway` | SFC | Sequential function charts |

### Driver Loggers
| Logger Name | Driver | Purpose |
|-------------|--------|---------|
| `drivers.modbus` | Modbus | Modbus communication |
| `drivers.logix` | Logix | Allen-Bradley Logix |
| `drivers.siemens` | Siemens | Siemens S7 |
| `drivers.opcua` | OPC UA | OPC UA client |

---

## Configuring Log Levels

### Via Gateway Web Interface
1. Go to: Config → System → Logging
2. Set levels for specific loggers
3. Changes apply immediately
4. No restart required

### Via logback.xml
```xml
<!-- Add or modify logger -->
<logger name="com.example.mymodule" level="DEBUG"/>

<!-- Change root level -->
<root level="DEBUG">
    <appender-ref ref="DBAppender"/>
</root>
```
**Note:** Requires Gateway restart

### Dynamic Level Changes
```python
# In Gateway script console
from com.inductiveautomation.ignition.common.logging import LoggerFactory
logger = LoggerFactory.getLogger("my.logger")
# Set level programmatically
```

---

## Log Management

### Database Maintenance

#### Size Limits
```xml
<!-- In logback.xml -->
<maxEvents>50000</maxEvents>           <!-- Total events -->
<maxEventsPerLogger>10000</maxEventsPerLogger>  <!-- Per logger -->
```

#### Manual Cleanup
```sql
-- Connect to system_logs.idb
-- Delete old logs
DELETE FROM logevents
WHERE eventtime < datetime('now', '-7 days');

-- Vacuum database
VACUUM;
```

### Wrapper Log Rotation
- Automatic rotation at 10MB
- Keeps 5 historical files
- Oldest deleted automatically

---

## Performance Considerations

### Log Level Impact
| Level | Performance Impact | Storage Impact |
|-------|-------------------|----------------|
| **TRACE** | Very High | Very High |
| **DEBUG** | High | High |
| **INFO** | Low | Medium |
| **WARN** | Very Low | Low |
| **ERROR** | Minimal | Minimal |

### Best Practices
1. **Production:** Use INFO or WARN for root
2. **Development:** Use DEBUG for specific loggers
3. **Troubleshooting:** Enable DEBUG temporarily
4. **Performance:** Disable unnecessary loggers

---

## Troubleshooting with Logs

### Common Issues and Log Locations

#### Gateway Startup Issues
```batch
# Check wrapper.log
type logs\wrapper.log | findstr ERROR
```

#### Database Connection Issues
- Logger: `gateway.database`
- Level: Set to DEBUG
- Look for connection strings, timeouts

#### Module Loading Issues
- Logger: `gateway.modules`
- Check wrapper.log for classpath issues
- Look for version conflicts

#### Memory Issues
```batch
# Check for OutOfMemory in wrapper
type logs\wrapper.log | findstr OutOfMemory
```

---

## Custom Logging

### Adding Custom Loggers
```xml
<!-- In logback.xml -->
<logger name="custom.integration" level="DEBUG">
    <appender-ref ref="DBAppender"/>
</logger>
```

### Script Logging
```python
# Gateway script
logger = system.util.getLogger("custom.script")
logger.info("Custom log message")
logger.error("Error occurred: %s" % str(error))
```

---

## Log Export and Backup

### Export via Gateway
1. Status → Diagnostics → Logs
2. Click "Export" button
3. Choose format (CSV, TSV)
4. Save file

### Direct Database Export
```batch
# Export logs database
sqlite3 logs\system_logs.idb .dump > logs_backup.sql
```

### Automated Backup Script
```python
# Gateway timer script
import shutil
from datetime import datetime

source = "C:/Program Files/Inductive Automation/Ignition/logs/system_logs.idb"
dest = "C:/Backups/logs_%s.idb" % datetime.now().strftime("%Y%m%d")
shutil.copy2(source, dest)
```

---

## Security Considerations

### Sensitive Information
- Passwords are masked in logs
- Connection strings sanitized
- User credentials not logged

### Log Access Control
- Logs contain operational data
- Restrict file system access
- Use Gateway roles for web access
- Encrypt log backups

---

## Related Documentation

- [Logging Guide](https://support.inductiveautomation.com/hc/en-us/articles/360047040891)
- [Logback Documentation](http://logback.qos.ch/manual/)
- [Troubleshooting Guide](https://docs.inductiveautomation.com/docs/8.3/appendix/troubleshooting)
- [Performance Tuning](https://support.inductiveautomation.com/hc/en-us/articles/360047172512)

---

*Reference: Ignition 8.3.0 - Logging Configuration*
*Configuration Files: data\logback.xml, data\ignition.conf*
*Last Updated: December 12, 2025*