# Gateway Configuration Reference

## Configuration Parameters

```params
primary_file: C:\Program Files\Inductive Automation\Ignition\data\gateway.xml
backup_file: C:\Program Files\Inductive Automation\Ignition\data\.gateway.xml.bak
http_port: 8088
https_port: 8043
metro_port: 8060
```

## Check Gateway Configuration

```python
#!/usr/bin/env python
import os
import xml.etree.ElementTree as ET

config_path = r"C:\Program Files\Inductive Automation\Ignition\data\gateway.xml"

def check_gateway():
    """Check gateway configuration"""
    if os.path.exists(config_path):
        print("✓ Gateway config found")
        try:
            tree = ET.parse(config_path)
            root = tree.getroot()

            settings = {}
            for entry in root.findall('.//entry'):
                key = entry.get('key', '')
                if 'port' in key.lower() or 'threads' in key:
                    settings[key] = entry.text
                    print(f"  {key}: {entry.text}")

            return settings
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("✗ Config not found")
        print("  Using default ports: 8088, 8043")
        return {'gateway.port': '8088', 'gateway.sslport': '8043'}

if __name__ == "__main__":
    check_gateway()
```

## Configuration Structure

The `gateway.xml` file is the primary configuration file for the Ignition Gateway. It contains all core gateway settings including network configuration, thread pools, and system parameters.

---

## Network Configuration

### HTTP/HTTPS Settings
```xml
<entry key="gateway.port">8088</entry>              <!-- HTTP Port -->
<entry key="gateway.sslport">8043</entry>           <!-- HTTPS Port -->
<entry key="gateway.metroSSLPort">8060</entry>      <!-- Metro SSL Port (GAN/EAM) -->
```

### Public Address Configuration
```xml
<entry key="gateway.publicAddress.address"></entry>  <!-- Public hostname/IP -->
<entry key="gateway.publicAddress.httpPort">0</entry>
<entry key="gateway.publicAddress.httpsPort">0</entry>
<entry key="gateway.publicAddress.autoDetect">true</entry>
```

**Official Documentation:** [Network Configuration](https://docs.inductiveautomation.com/docs/8.3/gateway-config/networking)

---

## Thread Pool Configuration

### Connection Pool Settings
```xml
<entry key="gateway.maxthreads">300</entry>         <!-- Maximum threads -->
<entry key="gateway.acceptcount">100</entry>        <!-- Accept queue size -->
<entry key="gateway.connectionTimeout">60000</entry> <!-- Connection timeout (ms) -->
<entry key="gateway.keepAliveTimeout">60000</entry>  <!-- Keep-alive timeout (ms) -->
<entry key="gateway.maxKeepAliveRequests">200</entry> <!-- Max keep-alive requests -->
```

### Thread Pool Documentation
- **maxthreads:** Maximum number of request processing threads
- **acceptcount:** Maximum queue length for incoming connections
- **connectionTimeout:** Time to wait for data after accepting connection
- **keepAliveTimeout:** Time to wait for next request on persistent connection

**Official Documentation:** [Performance Tuning](https://support.inductiveautomation.com/hc/en-us/articles/360047172512)

---

## SSL Configuration

### SSL Settings
```xml
<entry key="gateway.forceSecureRedirect">false</entry>
<entry key="gateway.requireSSL">false</entry>
```

### Metro SSL Configuration
The Metro SSL port (8060) is used for:
- Gateway Network (GAN) connections
- Enterprise Administration Module (EAM)
- Redundancy communications

**Official Documentation:** [SSL/TLS Configuration](https://docs.inductiveautomation.com/docs/8.3/security/ssl-tls-configuration)

---

## Proxy Configuration

### Proxy Settings
```xml
<entry key="gateway.useProxySettings">false</entry>
<entry key="gateway.useProxyWhitelist">true</entry>
<entry key="gateway.proxyWhitelist">localhost,127.0.0.1,0:0:0:0:0:0:0:1</entry>
```

---

## Session Configuration

### Session Management
```xml
<entry key="gateway.maxSessionsPerAddress">50</entry>  <!-- Max sessions per IP -->
```

This limits the number of concurrent sessions from a single IP address.

---

## Backup Configuration

### Scheduled Backup Settings
```xml
<entry key="gateway.backup.enable">false</entry>
<entry key="gateway.backup.schedule">0 0 2 * * ?</entry>  <!-- Cron expression -->
<entry key="gateway.backup.count">5</entry>                <!-- Backups to keep -->
<entry key="gateway.faultbackup.count">3</entry>           <!-- Fault backups -->
```

**Official Documentation:** [Gateway Backup](https://docs.inductiveautomation.com/docs/8.3/gateway-config/gateway-backup)

---

## System Properties

### Gateway Identity
```xml
<entry key="gateway.name"></entry>                    <!-- Gateway name -->
<entry key="gateway.uuid">[Generated UUID]</entry>    <!-- Unique identifier -->
```

### Locale Settings
```xml
<entry key="gateway.locale"></entry>                  <!-- System locale -->
```

---

## Advanced Settings

### Performance Settings
```xml
<entry key="gateway.maxmemory">2048</entry>          <!-- Max memory (MB) -->
```

### Debugging Options
```xml
<entry key="gateway.debug">false</entry>             <!-- Debug mode -->
```

---

## Configuration Best Practices

### Production Recommendations

1. **SSL/TLS**
   - Enable `requireSSL` for production environments
   - Configure proper certificates in `data\certificates\`
   - Use `forceSecureRedirect` to enforce HTTPS

2. **Thread Pools**
   - Monitor thread usage via Gateway Status page
   - Increase `maxthreads` for high-load environments
   - Adjust `acceptcount` based on connection patterns

3. **Backup Strategy**
   - Enable scheduled backups
   - Store backups on separate storage
   - Test restoration procedures regularly

4. **Public Address**
   - Configure explicit public address for multi-network environments
   - Required for proper WebDev and Perspective functioning

---

## Modifying Configuration

### Via Gateway Webpage
1. Navigate to http://localhost:8088
2. Go to Config → System → Gateway Settings
3. Make changes through web interface
4. Changes are saved to `gateway.xml` automatically

### Direct File Edit
1. Stop the Gateway service
2. Edit `data\gateway.xml`
3. Start the Gateway service
4. Changes take effect on restart

**Warning:** Direct editing can cause configuration errors. Always backup first.

---

## Configuration Monitoring

### View Current Configuration
- Gateway Webpage → Status → Overview
- Shows active ports, thread usage, memory
- Real-time performance metrics

### Configuration Logs
- Check `logs\wrapper.log` for configuration-related messages
- Gateway startup shows loaded configuration
- Port binding errors appear here

---

## Related Configuration Files

| File | Purpose | Relationship |
|------|---------|--------------|
| `ignition.conf` | JVM settings | Memory limits affect gateway performance |
| `redundancy.xml` | Redundancy config | Works with Metro SSL port |
| `logback.xml` | Logging config | Controls gateway.xml change logging |
| `config.idb` | Database config | Stores additional gateway settings |

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check ports 8088, 8043, 8060
   - Use `netstat -an | findstr :8088` to verify
   - Change port in gateway.xml if needed

2. **Thread Pool Exhaustion**
   - Increase `maxthreads`
   - Check for slow database queries
   - Review Gateway performance page

3. **SSL Certificate Issues**
   - Verify certificate in `data\certificates\`
   - Check `gateway.sslport` setting
   - Review SSL logs in wrapper.log

### Recovery Procedures

1. **Restore from Backup**
   ```
   copy data\.gateway.xml.bak data\gateway.xml
   ```

2. **Reset to Defaults**
   - Delete gateway.xml (creates new on start)
   - Gateway will use default settings
   - Reconfigure through web interface

---

## Security Considerations

### Recommended Security Settings
```xml
<entry key="gateway.requireSSL">true</entry>
<entry key="gateway.forceSecureRedirect">true</entry>
<entry key="gateway.maxSessionsPerAddress">10</entry>
```

### Security Documentation
- [Security Hardening Guide](https://support.inductiveautomation.com/hc/en-us/articles/360047166492)
- [Authentication Configuration](https://docs.inductiveautomation.com/docs/8.3/security/user-authentication)

---

*Reference: Ignition 8.3.0 - C:\Program Files\Inductive Automation\Ignition\data\gateway.xml*
*Last Updated: December 12, 2025*