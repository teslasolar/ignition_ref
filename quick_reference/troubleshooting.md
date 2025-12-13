# Troubleshooting Quick Reference

## Diagnostic Parameters

```params
service_name: Ignition Gateway
wrapper_log: C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log
gateway_port: 8088
max_log_lines: 100
```

## Gateway Diagnostics

```python
#!/usr/bin/env python
import subprocess
import os
import socket

def check_service():
    """Check Ignition service status"""
    try:
        result = subprocess.run(['sc', 'query', 'Ignition Gateway'],
                              capture_output=True, text=True)
        if 'RUNNING' in result.stdout:
            print("✓ Service is running")
            return True
        else:
            print("✗ Service not running")
            return False
    except:
        print("! Unable to check service")
        return False

def check_port(port=8088):
    """Check if gateway port is listening"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    if result == 0:
        print(f"✓ Port {port} is open")
        return True
    else:
        print(f"✗ Port {port} is closed")
        return False

def check_logs(log_path):
    """Check wrapper.log for errors"""
    if os.path.exists(log_path):
        print("✓ Log file found")
        with open(log_path, 'r', errors='ignore') as f:
            lines = f.readlines()[-100:]  # Last 100 lines
            errors = [l for l in lines if 'ERROR' in l or 'Exception' in l]
            if errors:
                print(f"! Found {len(errors)} errors")
                for e in errors[-3:]:  # Show last 3 errors
                    print(f"  {e.strip()[:80]}")
    else:
        print("✗ Log file not found")

def run_diagnostics():
    """Run all diagnostics"""
    print("=== Ignition Gateway Diagnostics ===")
    check_service()
    check_port()
    check_logs(r"C:\Program Files\Inductive Automation\Ignition\logs\wrapper.log")

if __name__ == "__main__":
    run_diagnostics()
```

### Common Causes and Solutions

| Issue | Check Location | Solution |
|-------|----------------|----------|
| **Port Conflict** | `logs\wrapper.log` - "Address already in use" | Change port in `data\gateway.xml` |
| **Memory Error** | `logs\wrapper.log` - "OutOfMemoryError" | Increase memory in `data\ignition.conf` |
| **License Issue** | `logs\wrapper.log` - "License" errors | Check `data\leased-activation\config.json` |
| **Module Fault** | `logs\wrapper.log` - Module errors | Disable module in `data\modules.json` |
| **Database Locked** | `logs\wrapper.log` - "database is locked" | Stop all Java processes, delete `.lck` files |

---

## Database Connection Issues

### Diagnostic Steps
1. **Test from Gateway**
   - Gateway → Config → Databases
   - Click "Test" on connection

2. **Check Logs**
   ```batch
   type logs\wrapper.log | findstr "database"
   ```

3. **Common Fixes**

| Database | Issue | Solution |
|----------|-------|----------|
| **MS SQL** | Login failed | Enable SQL authentication, check user permissions |
| **MySQL** | Connection refused | Check port 3306, verify bind-address |
| **PostgreSQL** | No pg_hba.conf entry | Update pg_hba.conf for host access |
| **All** | Timeout | Increase connection timeout, check firewall |

---

## High Memory Usage

### Check Memory Status
```batch
# Via Gateway status page
http://localhost:8088/web/status

# Check JVM settings
type data\ignition.conf | findstr memory
```

### Memory Optimization

| Component | Action | Location |
|-----------|--------|----------|
| **Increase Heap** | Set `wrapper.java.maxmemory=4096` | `data\ignition.conf` |
| **Tag History** | Reduce partition size | Gateway → Config → Tag History |
| **Perspective** | Limit concurrent sessions | Gateway → Config → Perspective |
| **Queries** | Optimize slow queries | Check database logs |

---

## Module Problems

### Module Won't Load
```batch
# Check module status
type data\modules.json

# Check module errors
type logs\wrapper.log | findstr -i "module"
```

### Common Module Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Version Mismatch** | Module requires different Ignition version | Update module or Ignition |
| **Missing Dependency** | "Could not resolve dependency" | Install required modules |
| **Certificate Error** | "Certificate validation failed" | Re-download module |
| **Corrupted File** | "Invalid module file" | Delete and re-install |

### Disable Problematic Module
1. Stop Gateway
2. Edit `data\modules.json`
3. Change module state to `"DISABLED"`
4. Start Gateway

---

## Performance Issues

### Quick Diagnostics
```batch
# Check thread count
netstat -an | findstr :8088 | find /c /v ""

# Check disk usage
dir data\db /s

# Check log size
dir logs /s
```

### Performance Checklist

| Area | Check | Action |
|------|-------|--------|
| **CPU High** | Task Manager → Java process | Check tag scan rates, reduce polling |
| **Disk I/O** | Resource Monitor → Disk | Check historian settings, log levels |
| **Network** | Packet loss, latency | Check device connections, reduce timeout |
| **Database** | Slow queries | Add indexes, optimize queries |

---

## SSL/Certificate Issues

### Common SSL Problems

| Error | Cause | Solution |
|-------|-------|----------|
| **ERR_CERT_AUTHORITY_INVALID** | Self-signed certificate | Import cert to browser |
| **SSL_ERROR_NO_CYPHER_OVERLAP** | Protocol mismatch | Update TLS settings |
| **Certificate expired** | Cert past expiration | Generate new certificate |

### Certificate Locations
- **SSL Certs:** `data\certificates\`
- **Metro Keystore:** `data\metro.ks`
- **Configuration:** `data\gateway.xml`

---

## Tag Issues

### Tags Not Updating
1. **Check OPC connection**
   - Gateway → Status → OPC Connections
2. **Check scan class**
   - Designer → Tag Browser → Edit Tag
3. **Check permissions**
   - Verify tag security settings

### Common Tag Problems

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Bad Quality** | Overlay on tag value | Check device connection |
| **Stale** | Value not updating | Check scan rate, leased mode |
| **Config Error** | Red overlay | Fix OPC item path |
| **Timeout** | Intermittent bad quality | Increase device timeout |

---

## Client Connection Issues

### Perspective Not Loading
```batch
# Check if service is running
curl http://localhost:8088/StatusPing

# Check for errors
type logs\wrapper.log | findstr perspective
```

### Connection Troubleshooting

| Client Type | Issue | Solution |
|-------------|-------|----------|
| **Perspective** | White screen | Clear browser cache, check console |
| **Designer** | Won't connect | Check firewall, use correct URL |
| **All Clients** | SSL warning | Import gateway certificate |

---

## Backup and Recovery

### Emergency Recovery Steps
1. **Stop Gateway**
   ```batch
   stop-ignition.bat
   ```

2. **Restore Configuration**
   ```batch
   copy data\db\autobackup\configdb_latest.idb data\db\config.idb
   ```

3. **Restore Gateway Settings**
   ```batch
   copy data\.gateway.xml.bak data\gateway.xml
   ```

4. **Start Gateway**
   ```batch
   start-ignition.bat
   ```

---

## Reset Procedures

### Reset Admin Password
```batch
gwcmd.bat --resets
```

### Reset to Factory Defaults
1. Stop Gateway
2. Delete `data\db\config.idb`
3. Delete `data\gateway.xml`
4. Start Gateway (creates new files)

### Clear Cache
```batch
REM Stop Gateway first
rmdir /s /q temp
rmdir /s /q data\jar-cache
mkdir temp
mkdir data\jar-cache
```

---

## Log Analysis Commands

### Find Errors
```batch
# Recent errors
type logs\wrapper.log | findstr /i error

# Java exceptions
type logs\wrapper.log | findstr Exception

# Module issues
type logs\wrapper.log | findstr /i "module"
```

### Monitor Real-Time
```powershell
# PowerShell - watch log
Get-Content logs\wrapper.log -Wait -Tail 50
```

---

## Common Error Messages

| Error | Meaning | Action |
|-------|---------|--------|
| **"Address already in use"** | Port conflict | Change port or stop conflicting service |
| **"OutOfMemoryError"** | Heap exhausted | Increase max memory |
| **"Too many open files"** | File handle limit | Restart gateway, check for leaks |
| **"Database is locked"** | SQLite lock | Kill Java processes, delete .lck files |
| **"Module license expired"** | Trial expired | Activate license |
| **"Clock skew detected"** | Time sync issue | Sync system time |

---

## Support Resources

### Gather Support Information
```batch
# Create support package
gwcmd.bat --backup support_backup.gwbk

# Export logs
xcopy logs\*.* support_logs\ /s

# System info
systeminfo > support_systeminfo.txt
```

### Online Resources
- **Support Portal:** https://support.inductiveautomation.com
- **Forum:** https://forum.inductiveautomation.com
- **Knowledge Base:** https://support.inductiveautomation.com/hc/en-us
- **Documentation:** https://docs.inductiveautomation.com/docs/8.3

---

## Health Check Script
```batch
@echo off
echo === Ignition Health Check ===
echo.

echo Checking service status...
sc query "Ignition Gateway" | findstr STATE

echo.
echo Checking ports...
netstat -an | findstr "8088 8043 8060"

echo.
echo Checking memory usage...
wmic process where "name='java.exe'" get WorkingSetSize /format:value

echo.
echo Checking recent errors...
type logs\wrapper.log | findstr /i "error exception" | find /c /v ""
echo errors found in wrapper.log

echo.
echo Checking disk space...
fsutil volume diskfree "C:"

echo.
echo === Health Check Complete ===
```

---

*Troubleshooting Quick Reference - Ignition 8.3.0*
*Installation: C:\Program Files\Inductive Automation\Ignition*
*Last Updated: December 12, 2025*