# Critical Paths Quick Reference

## Path Parameters

```params
ignition_root: C:\Program Files\Inductive Automation\Ignition
data_dir: C:\Program Files\Inductive Automation\Ignition\data
logs_dir: C:\Program Files\Inductive Automation\Ignition\logs
modules_dir: C:\Program Files\Inductive Automation\Ignition\user-lib\modules
```

## Check Critical Paths

```python
#!/usr/bin/env python
import os

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

critical_files = {
    'Gateway Config': 'data\\gateway.xml',
    'JVM Settings': 'data\\ignition.conf',
    'Module Registry': 'data\\modules.json',
    'Config Database': 'data\\db\\config.idb',
    'Wrapper Log': 'logs\\wrapper.log',
    'System Logs': 'logs\\system_logs.idb'
}

def check_critical_paths():
    """Check if critical Ignition files exist"""
    print("=== Critical Path Check ===")
    print(f"Root: {ignition_root}")

    if not os.path.exists(ignition_root):
        print("✗ Ignition root not found!")
        return False

    print("✓ Root directory exists\n")

    missing = []
    for name, path in critical_files.items():
        full_path = os.path.join(ignition_root, path)
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"✓ {name:15} ({size//1024:,} KB)")
        else:
            print(f"✗ {name:15} MISSING")
            missing.append(name)

    if missing:
        print(f"\n! Missing {len(missing)} critical files")
        return False
    else:
        print("\n✓ All critical files present")
        return True

if __name__ == "__main__":
    check_critical_paths()
```

## Essential Configuration Files

| File | Full Path | Purpose |
|------|-----------|---------|
| **Gateway Config** | `C:\Program Files\Inductive Automation\Ignition\data\gateway.xml` | Main gateway settings |
| **JVM Settings** | `C:\Program Files\Inductive Automation\Ignition\data\ignition.conf` | Memory and JVM options |
| **Module Registry** | `C:\Program Files\Inductive Automation\Ignition\data\modules.json` | Installed modules list |
| **Redundancy** | `C:\Program Files\Inductive Automation\Ignition\data\redundancy.xml` | Redundancy settings |
| **Logging Config** | `C:\Program Files\Inductive Automation\Ignition\data\logback.xml` | Log levels and output |

---

## Database Files

| Database | Full Path | Contents |
|----------|-----------|----------|
| **Configuration DB** | `C:\Program Files\Inductive Automation\Ignition\data\db\config.idb` | All gateway configuration |
| **Metrics DB** | `C:\Program Files\Inductive Automation\Ignition\data\metricsdb\metrics.idb` | Performance metrics |
| **System Logs DB** | `C:\Program Files\Inductive Automation\Ignition\logs\system_logs.idb` | Event logs |

---

## Log Files

| Log Type | Full Path | Purpose |
|----------|-----------|---------|
| **Current Log** | `C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log` | Active service log |
| **Previous Logs** | `C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log.1-5` | Rotated logs |
| **Install Logs** | `C:\Program Files\Inductive Automation\Ignition\logs\install_*.log` | Installation history |

---

## Project Locations

| Component | Path Pattern | Example |
|-----------|--------------|---------|
| **Project Root** | `data\projects\[ProjectName]\` | `data\projects\MyProject\` |
| **Project Config** | `data\projects\[ProjectName]\project.json` | `data\projects\MyProject\project.json` |
| **Project Resources** | `data\projects\[ProjectName]\ignition\` | `data\projects\MyProject\ignition\` |

---

## Module Locations

| Type | Full Path | Contents |
|------|-----------|----------|
| **Modules Directory** | `C:\Program Files\Inductive Automation\Ignition\user-lib\modules\` | All .modl files |
| **Python Libraries** | `C:\Program Files\Inductive Automation\Ignition\user-lib\pylib\` | Jython libraries |

---

## Backup Locations

| Backup Type | Full Path | Frequency |
|-------------|-----------|-----------|
| **Config Auto-backup** | `C:\Program Files\Inductive Automation\Ignition\data\db\autobackup\` | Every 60 seconds |
| **Upgrade Backups** | `C:\Program Files\Inductive Automation\Ignition\upgrade_backups\` | Before upgrades |
| **Gateway Backup** | `C:\Program Files\Inductive Automation\Ignition\data\.gateway.xml.bak` | On change |

---

## Certificate and Security

| Component | Full Path | Purpose |
|-----------|-----------|---------|
| **SSL Certificates** | `C:\Program Files\Inductive Automation\Ignition\data\certificates\` | SSL/TLS certificates |
| **Metro Keystore** | `C:\Program Files\Inductive Automation\Ignition\data\metro.ks` | GAN SSL keystore |
| **License Config** | `C:\Program Files\Inductive Automation\Ignition\data\leased-activation\config.json` | License activation |

---

## Runtime Files

| Component | Full Path | Purpose |
|-----------|-----------|---------|
| **Java Runtime** | `C:\Program Files\Inductive Automation\Ignition\lib\runtime\jre-win\` | JRE 17.0.16 |
| **Core Libraries** | `C:\Program Files\Inductive Automation\Ignition\lib\core\` | Ignition core JARs |
| **Wrapper** | `C:\Program Files\Inductive Automation\Ignition\lib\wrapper.jar` | Service wrapper |

---

## Executables and Scripts

| File | Full Path | Purpose |
|------|-----------|---------|
| **Service EXE** | `C:\Program Files\Inductive Automation\Ignition\IgnitionGateway.exe` | Windows service |
| **Gateway CMD** | `C:\Program Files\Inductive Automation\Ignition\gwcmd.bat` | Command-line tool |
| **Start Script** | `C:\Program Files\Inductive Automation\Ignition\start-ignition.bat` | Start gateway |
| **Stop Script** | `C:\Program Files\Inductive Automation\Ignition\stop-ignition.bat` | Stop gateway |

---

## Web Server Files

| Component | Full Path | Purpose |
|-----------|-----------|---------|
| **Web Apps** | `C:\Program Files\Inductive Automation\Ignition\webserver\webapps\` | Web applications |
| **Web Config** | `C:\Program Files\Inductive Automation\Ignition\webserver\webapps\main\WEB-INF\web.xml` | Web app config |

---

## Temporary Files

| Type | Full Path | Purpose |
|------|-----------|---------|
| **Temp Directory** | `C:\Program Files\Inductive Automation\Ignition\temp\` | Temporary files |
| **JDBC Cache** | `C:\Program Files\Inductive Automation\Ignition\temp\jdbc\` | JDBC drivers |
| **JAR Cache** | `C:\Program Files\Inductive Automation\Ignition\data\jar-cache\` | Module JARs |

---

## Quick Copy Commands

### Backup Critical Files
```batch
REM Backup gateway config
copy "C:\Program Files\Inductive Automation\Ignition\data\gateway.xml" backup\

REM Backup JVM config
copy "C:\Program Files\Inductive Automation\Ignition\data\ignition.conf" backup\

REM Backup configuration database
copy "C:\Program Files\Inductive Automation\Ignition\data\db\config.idb" backup\
```

### Access Logs
```batch
REM View current log
type "C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log"

REM Open logs directory
explorer "C:\Program Files\Inductive Automation\Ignition\logs"
```

### Navigate to Key Directories
```batch
REM Go to Ignition root
cd "C:\Program Files\Inductive Automation\Ignition"

REM Go to data directory
cd "C:\Program Files\Inductive Automation\Ignition\data"

REM Go to projects
cd "C:\Program Files\Inductive Automation\Ignition\data\projects"
```

---

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| **IGNITION_HOME** | `C:\Program Files\Inductive Automation\Ignition` | Installation directory |
| **IGNITION_DATA** | `C:\Program Files\Inductive Automation\Ignition\data` | Data directory |
| **JAVA_HOME** | `C:\Program Files\Inductive Automation\Ignition\lib\runtime\jre-win` | Java runtime |

---

## Critical URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Gateway Interface** | http://localhost:8088 | Main web interface |
| **Status Page** | http://localhost:8088/web/status | Gateway status |
| **Config Page** | http://localhost:8088/web/config | Configuration |
| **Status Ping** | http://localhost:8088/StatusPing | Health check |

---

## File Size Reference

| File/Directory | Typical Size | Growth Rate |
|----------------|--------------|-------------|
| **config.idb** | 1-10 MB | Slow |
| **system_logs.idb** | 1-50 MB | Moderate |
| **wrapper.log** | 0-10 MB | Daily rotation |
| **Projects** | Variable | Per project |
| **Modules** | ~95 MB | On update |
| **Java Runtime** | ~300 MB | Static |

---

## Permission Requirements

| Directory | Required Permission | Service Account |
|-----------|-------------------|-----------------|
| **Installation** | Read/Execute | SYSTEM |
| **data\** | Read/Write | SYSTEM |
| **logs\** | Read/Write | SYSTEM |
| **temp\** | Read/Write | SYSTEM |
| **user-lib\** | Read/Write | SYSTEM |

---

*Quick Reference: Ignition 8.3.0 Critical File Paths*
*Base Installation: C:\Program Files\Inductive Automation\Ignition*
*Last Updated: December 12, 2025*