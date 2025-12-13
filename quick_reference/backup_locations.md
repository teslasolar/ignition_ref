# Backup and Recovery Reference

## Backup Parameters

```params
backup_root: C:\Program Files\Inductive Automation\Ignition
autobackup_dir: data\db\autobackup
upgrade_backup_dir: upgrade_backups
retention_count: 5
backup_interval: 60
```

## Backup Management

```python
#!/usr/bin/env python
import os
import shutil
import datetime
from pathlib import Path

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

def check_backups():
    """Check existing backups"""
    print("=== Ignition Backup Check ===\n")

    # Check auto-backups
    autobackup = os.path.join(ignition_root, "data", "db", "autobackup")
    if os.path.exists(autobackup):
        backups = [f for f in os.listdir(autobackup) if f.endswith('.idb')]
        print(f"✓ Auto-backups: {len(backups)} found")
        if backups:
            latest = max(backups)
            print(f"  Latest: {latest}")
    else:
        print("✗ No auto-backup directory")

    # Check gateway.xml backup
    gateway_bak = os.path.join(ignition_root, "data", ".gateway.xml.bak")
    if os.path.exists(gateway_bak):
        size = os.path.getsize(gateway_bak) // 1024
        print(f"✓ Gateway backup: {size} KB")
    else:
        print("✗ No gateway.xml backup")

    # Check upgrade backups
    upgrade_dir = os.path.join(ignition_root, "upgrade_backups")
    if os.path.exists(upgrade_dir):
        upgrades = [f for f in os.listdir(upgrade_dir) if f.endswith('.gwbk')]
        print(f"✓ Upgrade backups: {len(upgrades)} found")
    else:
        print("! No upgrade backup directory")

def create_backup(dest_dir=None):
    """Create manual backup"""
    if not dest_dir:
        dest_dir = os.path.expanduser("~\\Documents\\IgnitionBackups")

    os.makedirs(dest_dir, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"manual_backup_{timestamp}"

    print(f"\n=== Creating Backup: {backup_name} ===")

    # Copy critical files
    files_to_backup = [
        ("data\\gateway.xml", "gateway.xml"),
        ("data\\ignition.conf", "ignition.conf"),
        ("data\\db\\config.idb", "config.idb")
    ]

    for src, dst in files_to_backup:
        src_path = os.path.join(ignition_root, src)
        dst_path = os.path.join(dest_dir, f"{backup_name}_{dst}")

        if os.path.exists(src_path):
            shutil.copy2(src_path, dst_path)
            print(f"✓ Backed up {dst}")
        else:
            print(f"✗ Could not backup {dst}")

    print(f"\nBackup saved to: {dest_dir}")

if __name__ == "__main__":
    check_backups()
    # Uncomment to create backup:
    # create_backup()
```

## Automatic Backup Locations

### Gateway Configuration Backup
**Primary:** `C:\Program Files\Inductive Automation\Ignition\data\gateway.xml`
**Backup:** `C:\Program Files\Inductive Automation\Ignition\data\.gateway.xml.bak`
**Created:** On every configuration change
**Contains:** Ports, threads, system settings

### Redundancy Configuration Backup
**Primary:** `C:\Program Files\Inductive Automation\Ignition\data\redundancy.xml`
**Backup:** `C:\Program Files\Inductive Automation\Ignition\data\.redundancy.xml.bak`
**Created:** On redundancy changes
**Contains:** GAN settings, redundancy role

### Upgrade Backups
**Location:** `C:\Program Files\Inductive Automation\Ignition\upgrade_backups\`
**File Pattern:** `backup_YYYYMMDDHHSS.gwbk`
**Created:** Automatically before upgrades
**Contains:** Complete gateway backup
**Size:** Variable (5-100+ MB)

---

## Manual Backup Procedures

### Complete Gateway Backup
```batch
# Using gwcmd
gwcmd.bat --backup "C:\Backups\gateway_backup.gwbk"

# Include options
gwcmd.bat --backup "C:\Backups\full_backup.gwbk" --include-projects --include-history
```

### Via Web Interface
1. Navigate to: http://localhost:8088
2. Go to: Config → Backup/Restore
3. Click "Download Backup"
4. Options:
   - Include projects
   - Include tag history
   - Include logs
   - Include image files

---

## Backup Contents by Type

### Gateway Backup (.gwbk) Contains

| Component | Included | Location in Backup |
|-----------|----------|-------------------|
| **Configuration** | Yes | config.idb |
| **Projects** | Optional | projects/ |
| **Tags** | Yes | In config.idb |
| **Users/Roles** | Yes | In config.idb |
| **Database Connections** | Yes | In config.idb |
| **Device Configurations** | Yes | In config.idb |
| **Alarm Pipelines** | Yes | In config.idb |
| **Scripts** | Yes | In projects |
| **Transaction Groups** | Yes | In projects |
| **Reports** | Yes | In projects |
| **SFCs** | Yes | In projects |

### What's NOT in Gateway Backup
- Tag history data (unless specified)
- Module files (.modl)
- SSL certificates
- Log files (unless specified)
- JVM configuration (ignition.conf)
- License activation files

---

## Critical Files to Backup Manually

### Configuration Files
```batch
# Create backup directory
mkdir C:\IgnitionBackups\config

# Backup critical configs
copy "C:\Program Files\Inductive Automation\Ignition\data\ignition.conf" C:\IgnitionBackups\config\
copy "C:\Program Files\Inductive Automation\Ignition\data\gateway.xml" C:\IgnitionBackups\config\
copy "C:\Program Files\Inductive Automation\Ignition\data\logback.xml" C:\IgnitionBackups\config\
copy "C:\Program Files\Inductive Automation\Ignition\data\modules.json" C:\IgnitionBackups\config\
```

### SSL Certificates
```batch
# Backup certificates
xcopy "C:\Program Files\Inductive Automation\Ignition\data\certificates" C:\IgnitionBackups\certificates\ /E /I
copy "C:\Program Files\Inductive Automation\Ignition\data\metro.ks" C:\IgnitionBackups\
```

### License Files
```batch
# Backup license activation
xcopy "C:\Program Files\Inductive Automation\Ignition\data\leased-activation" C:\IgnitionBackups\license\ /E /I
```

---

## Project Backup

### Individual Project Export
```batch
# Via gwcmd
gwcmd.bat --export-project "ProjectName" "C:\Backups\ProjectName.zip"
```

### All Projects Backup
```batch
# Backup all projects
xcopy "C:\Program Files\Inductive Automation\Ignition\data\projects" C:\IgnitionBackups\projects\ /E /I
```

### Project Structure Preserved
```
projects\
├── [ProjectName]\
│   ├── project.json        # Project settings
│   └── ignition\           # Project resources
│       ├── global-props\   # Properties
│       ├── perspectives\   # Perspective views
│       ├── reports\        # Reports
│       ├── script-library\ # Scripts
│       └── tags\          # Tags
```

---

## Database Backup

### Internal Databases
```batch
# Stop Gateway first for consistency

# Backup configuration database
copy "C:\Program Files\Inductive Automation\Ignition\data\db\config.idb" C:\IgnitionBackups\

# Backup metrics database
copy "C:\Program Files\Inductive Automation\Ignition\data\metricsdb\metrics.idb" C:\IgnitionBackups\

# Backup logs database
copy "C:\Program Files\Inductive Automation\Ignition\logs\system_logs.idb" C:\IgnitionBackups\
```

### SQLite Database Export
```batch
# Export to SQL format
sqlite3 data\db\config.idb .dump > config_backup.sql
```

---

## Restoration Procedures

### Full Gateway Restore
```batch
# Stop Gateway
stop-ignition.bat

# Restore via gwcmd
gwcmd.bat --restore "C:\Backups\gateway_backup.gwbk"

# Start Gateway
start-ignition.bat
```

### Selective Restoration

#### Restore Configuration Only
```batch
# Stop Gateway
stop-ignition.bat

# Backup current
copy data\db\config.idb data\db\config.idb.current

# Restore from auto-backup
copy data\db\autobackup\configdb_latest.idb data\db\config.idb

# Start Gateway
start-ignition.bat
```

#### Restore Gateway Settings
```batch
# Stop Gateway
stop-ignition.bat

# Restore gateway.xml
copy data\.gateway.xml.bak data\gateway.xml

# Start Gateway
start-ignition.bat
```

---

## Backup Schedule Recommendations

### Daily Backups
- Gateway configuration (automatic)
- Active project exports
- Database connections

### Weekly Backups
- Full gateway backup
- All projects
- SSL certificates
- Custom scripts

### Monthly Backups
- Complete system backup
- Module files
- Documentation
- License files

### Before Changes
- Always backup before:
  - Upgrades
  - Major configuration changes
  - Module installations
  - Security changes

---

## Backup Script Example

### Windows Batch Script
```batch
@echo off
REM Ignition Backup Script
REM Run daily via Task Scheduler

set BACKUP_DIR=C:\IgnitionBackups\%date:~-4,4%%date:~-10,2%%date:~-7,2%
set IGNITION_HOME=C:\Program Files\Inductive Automation\Ignition

echo Creating backup directory...
mkdir "%BACKUP_DIR%"

echo Backing up gateway...
"%IGNITION_HOME%\gwcmd.bat" --backup "%BACKUP_DIR%\gateway.gwbk"

echo Backing up configuration files...
copy "%IGNITION_HOME%\data\ignition.conf" "%BACKUP_DIR%\"
copy "%IGNITION_HOME%\data\gateway.xml" "%BACKUP_DIR%\"
copy "%IGNITION_HOME%\data\modules.json" "%BACKUP_DIR%\"

echo Backing up certificates...
xcopy "%IGNITION_HOME%\data\certificates" "%BACKUP_DIR%\certificates\" /E /I /Q

echo Backing up projects...
xcopy "%IGNITION_HOME%\data\projects" "%BACKUP_DIR%\projects\" /E /I /Q

echo Backup complete: %BACKUP_DIR%
```

---

## Recovery Time Objectives

| Backup Type | Backup Time | Restore Time | Data Loss |
|-------------|-------------|--------------|-----------|
| **Auto-backup** | Instant | < 5 min | < 60 seconds |
| **Gateway Backup** | 1-5 min | 5-15 min | Since last backup |
| **Manual Files** | 5-10 min | 10-20 min | Varies |
| **Full System** | 15-30 min | 30-60 min | Minimal |

---

## Backup Verification

### Test Restoration Process
1. Create test Gateway instance
2. Restore backup to test instance
3. Verify:
   - Projects load correctly
   - Tags are present
   - Database connections work
   - Users can login
   - Modules are loaded

### Backup Integrity Check
```batch
# Check backup file exists and size
dir C:\Backups\*.gwbk

# Verify backup contents (requires unzip)
REM .gwbk files are ZIP archives
```

---

## Cloud Backup Integration

### Example: Copy to Network Share
```batch
REM After local backup
xcopy C:\IgnitionBackups \\NetworkServer\Backups\Ignition\ /E /I /Y
```

### Example: Upload to Cloud
```powershell
# PowerShell - Upload to Azure Blob
$StorageAccount = "ignitionbackups"
$Container = "gateway"
$LocalFile = "C:\Backups\gateway.gwbk"

az storage blob upload --account-name $StorageAccount --container $Container --file $LocalFile
```

---

## Disaster Recovery Plan

### Priority Order for Recovery
1. **Gateway Configuration** (config.idb)
2. **Projects** (production critical)
3. **Tags and UDTs**
4. **Database Connections**
5. **User/Role Configuration**
6. **Transaction Groups**
7. **Reports and SFCs**
8. **Historical Data**

### Recovery Checklist
- [ ] Verify Ignition version matches backup
- [ ] Restore gateway.xml
- [ ] Restore config.idb
- [ ] Restore projects
- [ ] Verify module compatibility
- [ ] Test database connections
- [ ] Verify tag providers
- [ ] Test client access
- [ ] Verify alarm pipelines
- [ ] Check scheduled tasks

---

## Documentation

### Official Resources
- [Backup and Restore](https://docs.inductiveautomation.com/docs/8.3/gateway-config/gateway-backup)
- [gwcmd Reference](https://docs.inductiveautomation.com/docs/8.3/appendix/gwcmd)
- [Disaster Recovery](https://support.inductiveautomation.com/hc/en-us/articles/360047040951)

---

*Backup and Recovery Reference - Ignition 8.3.0*
*Installation: C:\Program Files\Inductive Automation\Ignition*
*Last Updated: December 12, 2025*