# Ignition 8.3.0 Complete File Inventory

## Reference Documentation
**Installation Path:** `C:\Program Files\Inductive Automation\Ignition`
**Version:** 8.3.0
**Official Documentation:** https://docs.inductiveautomation.com/docs/8.3

---

## Root Directory Files

| File Name | Type | Size | Purpose | Documentation |
|-----------|------|------|---------|---------------|
| `IgnitionGateway.exe` | Executable | 102 KB | Windows service executable for Ignition Gateway | [Service Management](https://docs.inductiveautomation.com/docs/8.3/getting-started/starting-and-stopping) |
| `gwcmd.bat` | Batch Script | 3 KB | Gateway command-line utility | [gwcmd Reference](https://docs.inductiveautomation.com/docs/8.3/appendix/gwcmd) |
| `start-ignition.bat` | Batch Script | 1 KB | Starts the Ignition Gateway service | [Starting Ignition](https://docs.inductiveautomation.com/docs/8.3/getting-started/starting-and-stopping) |
| `stop-ignition.bat` | Batch Script | 1 KB | Stops the Ignition Gateway service | [Stopping Ignition](https://docs.inductiveautomation.com/docs/8.3/getting-started/starting-and-stopping) |
| `ignition-secrets-tool.bat` | Batch Script | 2 KB | Manages encrypted secrets | [Security](https://docs.inductiveautomation.com/docs/8.3/security) |
| `License.html` | HTML | 25 KB | Software license agreement | - |
| `Notice.txt` | Text | 579 KB | Third-party software notices and licenses | - |
| `SBOM.txt` | Text | 1 MB | Software Bill of Materials listing all components | - |
| `wrapper-license.conf` | Config | 2 KB | Java Service Wrapper license configuration | - |

---

## Data Directory Files

### Core Configuration Files

| File Path | Type | Purpose | Backup | Documentation |
|-----------|------|---------|--------|---------------|
| `data\gateway.xml` | XML | Primary gateway configuration (ports, threads, settings) | `.gateway.xml.bak` | [Gateway Config](https://docs.inductiveautomation.com/docs/8.3/appendix/gateway-config-reference) |
| `data\redundancy.xml` | XML | Redundancy and GAN settings | `.redundancy.xml.bak` | [Redundancy Setup](https://docs.inductiveautomation.com/docs/8.3/redundancy) |
| `data\ignition.conf` | Config | JVM settings (memory, classpath, Java options) | Manual | [JVM Configuration](https://support.inductiveautomation.com/hc/en-us/articles/360047041311) |
| `data\logback.xml` | XML | Logging framework configuration | None | [Logging Configuration](https://support.inductiveautomation.com/hc/en-us/articles/360047040891) |
| `data\log4j.properties` | Properties | Legacy log4j configuration | None | - |
| `data\modules.json` | JSON | Installed modules registry | None | [Module Management](https://docs.inductiveautomation.com/docs/8.3/modules) |
| `data\metro.ks` | Keystore | Metro SSL keystore for secure communications | None | [SSL Configuration](https://docs.inductiveautomation.com/docs/8.3/security/ssl-tls-configuration) |

### Database Files

| File Path | Type | Size | Purpose | Documentation |
|-----------|------|------|---------|---------------|
| `data\db\config.idb` | SQLite | 1.1 MB | Main configuration database | [Database Configuration](https://docs.inductiveautomation.com/docs/8.3/databases) |
| `data\metricsdb\metrics.idb` | SQLite | 413 KB | Performance metrics database | [Performance Monitoring](https://docs.inductiveautomation.com/docs/8.3/gateway-config/diagnostics) |
| `logs\system_logs.idb` | SQLite | 1.3 MB | System event logs database | [Log Files](https://support.inductiveautomation.com/hc/en-us/articles/360047040891) |

### Project Files

| File Type | Location Pattern | Purpose | Documentation |
|-----------|-----------------|---------|---------------|
| `project.json` | `data\projects\[name]\` | Project metadata and settings | [Project Configuration](https://docs.inductiveautomation.com/docs/8.3/projects) |
| Global Properties | `data\projects\[name]\ignition\global-props\` | Global project properties | [Project Properties](https://docs.inductiveautomation.com/docs/8.3/projects/project-properties) |

---

## Library Files

### Core Library Structure

| Directory | Contents | Purpose | Documentation |
|-----------|----------|---------|---------------|
| `lib\core\common\` | JAR files | Common libraries shared across all components | - |
| `lib\core\gateway\` | JAR files | Gateway-specific libraries | - |
| `lib\core\client\` | JAR files | Vision client libraries | [Vision Module](https://docs.inductiveautomation.com/docs/8.3/vision) |
| `lib\core\designer\` | JAR files | Designer application libraries | [Designer](https://docs.inductiveautomation.com/docs/8.3/designer) |
| `lib\core\launch\` | JAR files | Launch utilities and bootstrapping | - |

### Runtime Files

| File Path | Type | Size | Purpose |
|-----------|------|------|---------|
| `lib\runtime\version` | Text | 8 bytes | Java version (17.0.16) |
| `lib\runtime\jre-win\` | Directory | 300+ MB | Extracted Windows JRE |
| `lib\runtime\jre-mac.tar.gz` | Archive | 100+ MB | macOS JRE archive |
| `lib\runtime\jre-nix.tar.gz` | Archive | 100+ MB | Linux JRE archive |
| `lib\runtime\client-exports.conf` | Config | 2 KB | Client JVM exports configuration |

### Key Library Files

| File Name | Type | Purpose | Documentation |
|-----------|------|---------|---------------|
| `lib\wrapper.jar` | JAR | Java Service Wrapper main library | [Wrapper Documentation](http://wrapper.tanukisoftware.org/) |
| `lib\wrapper-windows-x86-64.dll` | DLL | Windows 64-bit wrapper native library | - |
| `lib\install-info.txt` | Text | Installation metadata (version, architecture) | - |

---

## Module Files

### Installed Modules (user-lib\modules\)

| Module File | Version | Size | Purpose |
|-------------|---------|------|---------|
| `Alarm Notification-module.modl` | 6.3.0 | 1.0 MB | Alarm delivery and escalation system |
| `Allen-Bradley Drivers-module.modl` | 7.3.0 | 425 KB | Legacy Allen-Bradley PLC drivers |
| `EventStream-module.modl` | 3.3.0 | 800 KB | Event streaming framework |
| `Historian-module.modl` | 3.3.0 | 26.5 MB | Tag history storage engine |
| `Logix Driver-module.modl` | 5.3.0 | 489 KB | Allen-Bradley Logix PLC driver |
| `MariaDB JDBC Driver-module.modl` | 4.3.0 | 631 KB | MariaDB database connectivity |
| `Micro800 Driver-module.modl` | 2.3.0 | 620 KB | Allen-Bradley Micro800 driver |
| `Mitsubishi Driver-module.modl` | 4.3.0 | 293 KB | Mitsubishi PLC communication |
| `Modbus Driver v2-module.modl` | 2.3.0 | 456 KB | Modbus TCP/RTU protocol |
| `MSSQL JDBC Driver-module.modl` | 4.3.0 | 1.3 MB | Microsoft SQL Server driver |
| `Omron Driver-module.modl` | 4.3.0 | 1.0 MB | Omron PLC communication |
| `OPC-UA-module.modl` | 9.3.0 | 24.6 MB | OPC UA server and client |
| `Perspective-module.modl` | 2.3.0 | 14.3 MB | Web-based HMI platform |
| `PostgreSQL JDBC Driver-module.modl` | 4.3.0 | 1.0 MB | PostgreSQL database driver |
| `Reporting-module.modl` | 6.3.0 | 11.8 MB | Report generation and scheduling |
| `SFC-module.modl` | 5.3.0 | 1.2 MB | Sequential Function Charts |
| `Siemens Drivers-module.modl` | 6.3.0 | 634 KB | Siemens S7 PLC drivers |
| `SQL Bridge-module.modl` | 10.3.0 | 1.4 MB | Transaction groups for database |
| `SQL Historian-module.modl` | 1.3.0 | 186 KB | SQL-based tag historian |
| `UDP and TCP Drivers-module.modl` | 2.3.0 | 96 KB | Generic UDP/TCP drivers |

---

## Log Files

| File Name | Type | Max Size | Purpose | Rotation |
|-----------|------|----------|---------|----------|
| `logs\wrapper.log` | Text | 10 MB | Current wrapper service log | Active |
| `logs\wrapper.log.1` | Text | 10 MB | First rotated log | Rotated |
| `logs\wrapper.log.2` | Text | 10 MB | Second rotated log | Rotated |
| `logs\wrapper.log.3` | Text | 10 MB | Third rotated log | Rotated |
| `logs\wrapper.log.4` | Text | 10 MB | Fourth rotated log | Rotated |
| `logs\wrapper.log.5` | Text | 10 MB | Fifth rotated log | Rotated |
| `logs\install_*.log` | Text | Variable | Installation and upgrade logs | Per operation |

---

## Web Server Files

| File Path | Type | Purpose | Documentation |
|-----------|------|---------|---------------|
| `webserver\webapps\main\WEB-INF\web.xml` | XML | Main web application configuration | [Web Configuration](https://docs.inductiveautomation.com/docs/8.3/web-services) |
| `webserver\webapps\main\favicon.ico` | Icon | Browser favicon | - |
| `webserver\webdefault.xml` | XML | Jetty web server default configuration | - |

---

## Temporary and Cache Files

| Directory/File | Purpose | Cleanup |
|----------------|---------|---------|
| `temp\jdbc\` | JDBC driver cache | Automatic |
| `temp\module_exports\` | Module export cache | Automatic |
| `temp\pylib_compressed.zip` | Compressed Python libraries (2.8 MB) | Persistent |
| `data\jar-cache\` | JAR file cache for modules | Automatic |

---

## Backup Files

| Location | File Pattern | Purpose | Retention |
|----------|-------------|---------|-----------|
| `data\db\autobackup\` | `configdb_*.idb` | Automatic configuration backups | Last 5 |
| `upgrade_backups\` | `backup_*.gwbk` | Full gateway backups before upgrades | Manual cleanup |

---

## License and Activation Files

| File Path | Type | Purpose | Documentation |
|-----------|------|---------|---------------|
| `data\leased-activation\config.json` | JSON | License activation configuration | [Licensing](https://docs.inductiveautomation.com/docs/8.3/licensing) |
| `data\leased-activation\.cached-response-*` | Cache | Cached license server responses | - |

---

## Python/Jython Files

| Location | Contents | Version | Purpose |
|----------|----------|---------|---------|
| `user-lib\pylib\Lib\` | Python standard library | Jython 2.7 | Script support |
| `user-lib\pylib\site-packages\` | Third-party packages | Various | Additional Python modules |

---

## Certificate Files

| Location | Purpose | Documentation |
|----------|---------|---------------|
| `data\certificates\supplemental\` | Additional SSL/TLS certificates | [SSL Configuration](https://docs.inductiveautomation.com/docs/8.3/security/ssl-tls-configuration) |

---

## Critical File Relationships

### Configuration Dependencies
1. **`gateway.xml`** → Defines ports, threads, public address
2. **`ignition.conf`** → Controls JVM memory and classpath
3. **`modules.json`** → Lists enabled modules
4. **`config.idb`** → Stores all gateway configuration in SQLite

### Backup Chain
1. **Primary:** `data\db\config.idb`
2. **Auto-backup:** `data\db\autobackup\configdb_*.idb`
3. **Upgrade backup:** `upgrade_backups\backup_*.gwbk`

### Log Chain
1. **Active:** `logs\wrapper.log`
2. **Rotated:** `logs\wrapper.log.1-5`
3. **Database:** `logs\system_logs.idb`

---

## File Size Summary

### Largest Files
1. **`Historian-module.modl`** - 26.5 MB
2. **`OPC-UA-module.modl`** - 24.6 MB
3. **`Perspective-module.modl`** - 14.3 MB
4. **`Reporting-module.modl`** - 11.8 MB
5. **Java Runtime** - 300+ MB (extracted)

### Database Sizes
- **Configuration:** 1.1 MB
- **System Logs:** 1.3 MB
- **Metrics:** 413 KB

---

*Last Updated: December 12, 2025*
*Reference: Ignition 8.3.0 Installation at C:\Program Files\Inductive Automation\Ignition*