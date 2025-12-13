# JVM Configuration Reference

## JVM Parameters

```params
config_file: C:\Program Files\Inductive Automation\Ignition\data\ignition.conf
initial_memory: 1024
max_memory: 2048
java_version: 17.0.16
edition: maker
```

## Check JVM Configuration

```python
#!/usr/bin/env python
import os
import re

config_file = r"C:\Program Files\Inductive Automation\Ignition\data\ignition.conf"

def check_jvm_config():
    """Check and display JVM configuration"""
    print("=== JVM Configuration Check ===\n")

    if not os.path.exists(config_file):
        print(f"✗ Config file not found: {config_file}")
        print("  Using default settings: 1024MB initial, 2048MB max")
        return

    print(f"✓ Config file found\n")

    settings = {}
    with open(config_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                if 'wrapper.java.initmemory' in line:
                    match = re.search(r'=(\d+)', line)
                    if match:
                        settings['Initial Memory'] = f"{match.group(1)} MB"
                elif 'wrapper.java.maxmemory' in line:
                    match = re.search(r'=(\d+)', line)
                    if match:
                        settings['Max Memory'] = f"{match.group(1)} MB"
                elif 'wrapper.java.command' in line:
                    if 'jre-win' in line:
                        settings['Java Runtime'] = 'Bundled Windows JRE'
                elif '-Dedition=' in line:
                    match = re.search(r'-Dedition=(\w+)', line)
                    if match:
                        settings['Edition'] = match.group(1)

    print("JVM Settings:")
    for key, value in settings.items():
        print(f"  {key:15}: {value}")

    # Memory recommendations
    total_mb = int(settings.get('Max Memory', '2048 MB').split()[0])
    if total_mb < 2048:
        print("\n⚠ Consider increasing max memory for production")
    else:
        print(f"\n✓ Memory allocation adequate ({total_mb} MB)")

if __name__ == "__main__":
    check_jvm_config()
```

## Overview

The `ignition.conf` file controls the Java Virtual Machine (JVM) settings for the Ignition Gateway. This file is based on the Java Service Wrapper configuration format and determines memory allocation, Java runtime options, and classpath settings.

---

## Current Configuration (Ignition 8.3.0)

### Memory Settings
```properties
# Initial Java Heap Size (MB)
wrapper.java.initmemory=1024

# Maximum Java Heap Size (MB)
wrapper.java.maxmemory=2048
```

### Java Runtime
```properties
# Java Home Directory
wrapper.java.command=lib/runtime/jre-win/bin/java
```

### Edition Setting
```properties
# Ignition Edition
wrapper.java.additional.2=-Dedition=maker
```

---

## Memory Configuration Details

### Heap Memory
| Setting | Current Value | Purpose | Recommendation |
|---------|--------------|---------|----------------|
| **Initial Memory** | 1024 MB | Starting heap size | 25-50% of max memory |
| **Maximum Memory** | 2048 MB | Maximum heap size | Based on available RAM |

### Memory Sizing Guidelines

#### Small Systems (Development/Testing)
- Initial: 1024 MB
- Maximum: 2048 MB
- Suitable for: < 1000 tags, < 10 clients

#### Medium Systems (Production)
- Initial: 2048 MB
- Maximum: 4096 MB
- Suitable for: 1000-10000 tags, 10-50 clients

#### Large Systems (Enterprise)
- Initial: 4096 MB
- Maximum: 8192 MB or higher
- Suitable for: > 10000 tags, > 50 clients

**Official Documentation:** [Memory Configuration Guide](https://support.inductiveautomation.com/hc/en-us/articles/360047041311)

---

## Java Additional Parameters

### Module System Opens (Java 17)
```properties
# Required for Java 17 module system
wrapper.java.additional.3=--add-opens=java.base/java.lang=ALL-UNNAMED
wrapper.java.additional.4=--add-opens=java.base/java.lang.invoke=ALL-UNNAMED
wrapper.java.additional.5=--add-opens=java.base/java.lang.reflect=ALL-UNNAMED
wrapper.java.additional.6=--add-opens=java.base/java.io=ALL-UNNAMED
wrapper.java.additional.7=--add-opens=java.base/java.net=ALL-UNNAMED
wrapper.java.additional.8=--add-opens=java.base/java.nio=ALL-UNNAMED
wrapper.java.additional.9=--add-opens=java.base/java.util=ALL-UNNAMED
wrapper.java.additional.10=--add-opens=java.base/java.util.concurrent=ALL-UNNAMED
wrapper.java.additional.11=--add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED
wrapper.java.additional.12=--add-opens=java.base/sun.nio.ch=ALL-UNNAMED
wrapper.java.additional.13=--add-opens=java.base/sun.nio.cs=ALL-UNNAMED
wrapper.java.additional.14=--add-opens=java.base/sun.security.action=ALL-UNNAMED
wrapper.java.additional.15=--add-opens=java.base/sun.util.calendar=ALL-UNNAMED
wrapper.java.additional.16=--add-opens=java.security.jgss/sun.security.krb5=ALL-UNNAMED
wrapper.java.additional.17=--add-opens=java.desktop/java.awt=ALL-UNNAMED
wrapper.java.additional.18=--add-opens=java.desktop/java.beans=ALL-UNNAMED
wrapper.java.additional.19=--add-opens=java.desktop/sun.awt=ALL-UNNAMED
wrapper.java.additional.20=--add-opens=java.desktop/sun.swing=ALL-UNNAMED
wrapper.java.additional.21=--add-opens=java.desktop/javax.swing=ALL-UNNAMED
wrapper.java.additional.22=--add-opens=java.desktop/javax.swing.border=ALL-UNNAMED
wrapper.java.additional.23=--add-opens=java.desktop/javax.swing.plaf.basic=ALL-UNNAMED
wrapper.java.additional.24=--add-opens=java.desktop/javax.imageio=ALL-UNNAMED
wrapper.java.additional.25=--add-opens=java.desktop/javax.imageio.spi=ALL-UNNAMED
wrapper.java.additional.26=--add-opens=java.desktop/com.sun.java.swing.plaf.windows=ALL-UNNAMED
wrapper.java.additional.27=--add-opens=java.desktop/sun.awt.windows=ALL-UNNAMED
wrapper.java.additional.28=--add-opens=java.management/sun.management=ALL-UNNAMED
wrapper.java.additional.29=--add-opens=jdk.management/com.sun.management.internal=ALL-UNNAMED
wrapper.java.additional.30=--add-opens=java.base/java.util.concurrent.locks=ALL-UNNAMED
```

### Other JVM Options
```properties
# Illegal Access (deprecated in Java 17+)
wrapper.java.additional.31=--illegal-access=warn

# System Properties
wrapper.java.additional.32=-Djavax.net.ssl.trustStorePassword=ignition
```

---

## Classpath Configuration

### Library Paths
```properties
# Core libraries
wrapper.java.classpath.1=lib/core/gateway/*
wrapper.java.classpath.2=lib/core/launch/*

# Additional libraries
wrapper.java.classpath.3=lib/wrapper.jar
wrapper.java.classpath.4=lib/runtime/java17.jar
```

---

## Performance Tuning

### Garbage Collection Options

#### G1GC (Recommended for most systems)
```properties
wrapper.java.additional.40=-XX:+UseG1GC
wrapper.java.additional.41=-XX:MaxGCPauseMillis=200
```

#### ZGC (Low latency, Java 17+)
```properties
wrapper.java.additional.40=-XX:+UseZGC
wrapper.java.additional.41=-XX:ZCollectionInterval=30
```

### JVM Monitoring
```properties
# Enable JMX for monitoring
wrapper.java.additional.50=-Dcom.sun.management.jmxremote
wrapper.java.additional.51=-Dcom.sun.management.jmxremote.port=9090
wrapper.java.additional.52=-Dcom.sun.management.jmxremote.authenticate=false
wrapper.java.additional.53=-Dcom.sun.management.jmxremote.ssl=false
```

---

## Wrapper Configuration

### Service Settings
```properties
# Wrapper logging
wrapper.console.format=PM
wrapper.console.loglevel=INFO
wrapper.logfile=logs/wrapper.log
wrapper.logfile.format=LPTM
wrapper.logfile.loglevel=INFO
wrapper.logfile.maxsize=10m
wrapper.logfile.maxfiles=5

# Restart on failure
wrapper.restart.delay=30
wrapper.restart.reload_configuration=TRUE
```

### Timeout Settings
```properties
# Startup timeout (seconds)
wrapper.startup.timeout=300

# Ping timeout (seconds)
wrapper.ping.timeout=30
```

---

## Common Modifications

### Increase Memory for Large Systems
```properties
# For 8GB allocation
wrapper.java.initmemory=4096
wrapper.java.maxmemory=8192
```

### Add Custom System Properties
```properties
# Add after existing wrapper.java.additional entries
wrapper.java.additional.100=-Dmy.custom.property=value
```

### Enable Debug Logging
```properties
# Verbose GC logging
wrapper.java.additional.101=-verbose:gc
wrapper.java.additional.102=-XX:+PrintGCDetails
wrapper.java.additional.103=-XX:+PrintGCDateStamps
wrapper.java.additional.104=-Xloggc:logs/gc.log
```

---

## Troubleshooting

### OutOfMemoryError
**Symptoms:** Gateway crashes, "OutOfMemoryError" in logs
**Solution:** Increase `wrapper.java.maxmemory`
```properties
wrapper.java.maxmemory=4096
```

### Slow Performance
**Symptoms:** High CPU usage, slow response times
**Solution:** Tune garbage collection
```properties
wrapper.java.additional.40=-XX:+UseG1GC
wrapper.java.additional.41=-XX:MaxGCPauseMillis=100
wrapper.java.additional.42=-XX:+ParallelRefProcEnabled
```

### Module Loading Issues
**Symptoms:** Modules fail to load
**Solution:** Verify Java module opens are present (Java 17 requires explicit opens)

---

## Monitoring Memory Usage

### Gateway Status Page
- Navigate to: http://localhost:8088/StatusPing
- Shows current memory usage
- Real-time heap statistics

### Wrapper Log
- Location: `logs\wrapper.log`
- Shows JVM startup parameters
- Memory allocation messages

### Enable Detailed Memory Logging
```properties
wrapper.java.additional.105=-XX:+PrintHeapAtGC
wrapper.java.additional.106=-XX:+PrintTenuringDistribution
```

---

## Best Practices

### Production Systems
1. Set initial memory to 50-75% of max memory
2. Monitor memory usage patterns
3. Enable GC logging for analysis
4. Test changes in development first
5. Keep wrapper.log rotation enabled

### Development Systems
1. Use lower memory settings
2. Enable debug options
3. Consider verbose GC logging
4. Quick restart settings

### Backup Strategy
Always backup `ignition.conf` before modifications:
```batch
copy data\ignition.conf data\ignition.conf.backup
```

---

## Related Documentation

- [JVM Tuning Guide](https://support.inductiveautomation.com/hc/en-us/articles/360047041311)
- [Performance Tuning](https://support.inductiveautomation.com/hc/en-us/articles/360047172512)
- [Java Service Wrapper](http://wrapper.tanukisoftware.org/)
- [Gateway Configuration](https://docs.inductiveautomation.com/docs/8.3/appendix/gateway-config-reference)

---

## Quick Reference Commands

### Restart with New Settings
```batch
# Windows
stop-ignition.bat
start-ignition.bat

# Or via service
net stop "Ignition Gateway"
net start "Ignition Gateway"
```

### Verify Settings Applied
Check `logs\wrapper.log` for:
```
JVM Arguments:
  -Xms1024m
  -Xmx2048m
  -Dedition=maker
  [other arguments...]
```

---

*Reference: Ignition 8.3.0 - C:\Program Files\Inductive Automation\Ignition\data\ignition.conf*
*Java Version: 17.0.16*
*Last Updated: December 12, 2025*