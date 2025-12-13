# Network Ports Configuration Reference

## Port Configuration

```params
http_port: 8088
https_port: 8043
metro_ssl_port: 8060
opcua_port: 4840
modbus_port: 502
config_file: C:\Program Files\Inductive Automation\Ignition\data\gateway.xml
```

## Check Port Availability

```python
#!/usr/bin/env python
import socket
import subprocess

ignition_ports = {
    'HTTP': 8088,
    'HTTPS': 8043,
    'Metro SSL': 8060,
    'OPC UA': 4840,
    'Modbus': 502
}

def check_port(host='localhost', port=80):
    """Check if port is open"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def scan_ignition_ports():
    """Scan all Ignition ports"""
    print("Scanning Ignition Ports:")
    for name, port in ignition_ports.items():
        status = "OPEN" if check_port('localhost', port) else "CLOSED"
        print(f"  {name:12} ({port:5}): {status}")

if __name__ == "__main__":
    scan_ignition_ports()
```

## Primary Gateway Ports

### HTTP Port (8088)
| Property | Value | Purpose |
|----------|-------|---------|
| **Port Number** | 8088 | Standard HTTP web traffic |
| **Protocol** | HTTP | Unencrypted web communication |
| **Configuration Key** | `gateway.port` | In gateway.xml |
| **Default URL** | http://localhost:8088 | Gateway web interface |

**Used For:**
- Gateway Configuration Interface
- Perspective Sessions (non-SSL)
- Designer Launcher connections
- Web Services/REST API
- WebDev module endpoints

### HTTPS Port (8043)
| Property | Value | Purpose |
|----------|-------|---------|
| **Port Number** | 8043 | Secure HTTPS web traffic |
| **Protocol** | HTTPS/TLS | Encrypted web communication |
| **Configuration Key** | `gateway.sslport` | In gateway.xml |
| **Default URL** | https://localhost:8043 | Secure gateway interface |

**Used For:**
- Secure Gateway Configuration
- Encrypted Perspective Sessions
- Secure Designer connections
- Encrypted Web Services
- Production deployments

### Metro SSL Port (8060)
| Property | Value | Purpose |
|----------|-------|---------|
| **Port Number** | 8060 | Gateway Network communication |
| **Protocol** | SSL/TLS | Encrypted gateway-to-gateway |
| **Configuration Key** | `gateway.metroSSLPort` | In gateway.xml |
| **Security** | Certificate-based | Mutual TLS authentication |

**Used For:**
- Gateway Area Network (GAN)
- Enterprise Administration Module (EAM)
- Redundancy connections
- Remote tag providers
- Distributed systems

---

## Module-Specific Ports

### OPC UA Module
| Port | Purpose | Configuration Location |
|------|---------|----------------------|
| **4096** | Discovery Server | OPC UA Server Settings |
| **4840** | OPC UA Server | OPC UA Server Settings |

**Configuration:** Gateway → Config → OPC UA → Server Settings
**Documentation:** [OPC UA Module](https://docs.inductiveautomation.com/docs/8.3/opc-ua)

### Modbus Driver
| Port | Purpose | Protocol |
|------|---------|----------|
| **502** | Modbus TCP | TCP/IP |

**Note:** Port configured per device connection
**Documentation:** [Modbus Driver](https://docs.inductiveautomation.com/docs/8.3/drivers/modbus)

### Database Connections
| Database | Default Port | Notes |
|----------|-------------|-------|
| **MySQL/MariaDB** | 3306 | Standard MySQL port |
| **PostgreSQL** | 5432 | Standard PostgreSQL port |
| **Microsoft SQL** | 1433 | Standard MSSQL port |
| **Oracle** | 1521 | Standard Oracle port |

---

## Port Configuration Guide

### Changing HTTP Port
```xml
<!-- In gateway.xml -->
<entry key="gateway.port">8088</entry>
<!-- Change to desired port -->
<entry key="gateway.port">8080</entry>
```

**Via Web Interface:**
1. Gateway → Config → System → Gateway Settings
2. Change "HTTP Port" field
3. Save and restart

### Changing HTTPS Port
```xml
<!-- In gateway.xml -->
<entry key="gateway.sslport">8043</entry>
<!-- Change to desired port -->
<entry key="gateway.sslport">443</entry>
```

### Changing Metro SSL Port
```xml
<!-- In gateway.xml -->
<entry key="gateway.metroSSLPort">8060</entry>
<!-- Change for GAN conflicts -->
<entry key="gateway.metroSSLPort">8061</entry>
```

---

## Firewall Configuration

### Windows Firewall Rules

#### Inbound Rules Required
```batch
# HTTP Port
netsh advfirewall firewall add rule name="Ignition HTTP" dir=in action=allow protocol=TCP localport=8088

# HTTPS Port
netsh advfirewall firewall add rule name="Ignition HTTPS" dir=in action=allow protocol=TCP localport=8043

# Metro SSL (if using GAN)
netsh advfirewall firewall add rule name="Ignition Metro" dir=in action=allow protocol=TCP localport=8060

# OPC UA (if enabled)
netsh advfirewall firewall add rule name="Ignition OPC UA" dir=in action=allow protocol=TCP localport=4840
```

#### Check Open Ports
```batch
# View all listening ports
netstat -an | findstr LISTENING

# Check specific Ignition ports
netstat -an | findstr :8088
netstat -an | findstr :8043
netstat -an | findstr :8060
```

---

## Port Conflict Resolution

### Common Conflicts

#### Port 8088 Already in Use
**Common Conflicts:** Other web servers, development tools
**Resolution:**
1. Identify process: `netstat -ano | findstr :8088`
2. Change Ignition port or stop conflicting service
3. Update gateway.xml and restart

#### Port 8043 Already in Use
**Common Conflicts:** Other HTTPS services
**Resolution:**
1. Use alternative port (e.g., 8443)
2. Update SSL configurations
3. Update client connections

#### Port 502 (Modbus) Conflict
**Common Conflicts:** Other Modbus servers
**Resolution:**
1. Use different port per device
2. Configure in device settings
3. Update PLC/device configuration

---

## Network Architecture

### Single Gateway Setup
```
Internet → Firewall → Gateway (8088/8043) → Clients
                   ↓
                PLCs/Devices (various ports)
```

### Redundant Gateway Setup
```
Primary Gateway (8088/8043/8060) ←→ Backup Gateway (8088/8043/8060)
              ↓                              ↓
         Clients/Devices              Clients/Devices
```

### Gateway Network (GAN)
```
Central Gateway (8060) ← SSL/TLS → Remote Gateway 1 (8060)
                      ← SSL/TLS → Remote Gateway 2 (8060)
                      ← SSL/TLS → Remote Gateway N (8060)
```

---

## Security Best Practices

### Port Security Recommendations

1. **Disable Unused Ports**
   - If not using HTTP, set port to 0
   - Disable OPC UA if not needed
   - Close unnecessary database ports

2. **Use HTTPS Only**
   ```xml
   <entry key="gateway.requireSSL">true</entry>
   <entry key="gateway.forceSecureRedirect">true</entry>
   ```

3. **Firewall Rules**
   - Restrict source IPs when possible
   - Use network segmentation
   - Implement DMZ for external access

4. **Non-Standard Ports**
   - Consider using non-standard ports
   - Document changes thoroughly
   - Update all client configurations

---

## Port Testing and Diagnostics

### Test Port Connectivity

#### From Windows
```batch
# Test if port is open
powershell Test-NetConnection localhost -Port 8088

# Telnet test (if enabled)
telnet localhost 8088
```

#### Check Service Status
```batch
# Via browser
http://localhost:8088/StatusPing

# Via curl
curl http://localhost:8088/StatusPing
```

### Port Monitoring
```batch
# Monitor specific port
netstat -an | findstr :8088

# Monitor all Ignition ports
netstat -an | findstr "8088 8043 8060"
```

---

## Load Balancer Configuration

### For High Availability
```
Load Balancer (443) → Backend Gateways (8043)
                   ├→ Gateway 1 (8043)
                   ├→ Gateway 2 (8043)
                   └→ Gateway N (8043)
```

### Health Check Endpoints
- **HTTP:** http://gateway:8088/StatusPing
- **HTTPS:** https://gateway:8043/StatusPing

---

## Troubleshooting Common Issues

### Port Binding Errors
**Error:** "Address already in use"
**Solution:**
1. Check wrapper.log for details
2. Find conflicting process
3. Change port or stop conflict
4. Restart Gateway

### SSL Certificate Issues
**Error:** "SSL handshake failed"
**Solution:**
1. Verify certificate validity
2. Check certificate path
3. Verify port 8043 is open
4. Check firewall rules

### Connection Timeouts
**Error:** "Connection timed out"
**Solution:**
1. Verify firewall rules
2. Check network connectivity
3. Verify correct port number
4. Check Gateway status

---

## Port Usage Summary Table

| Port | Protocol | Purpose | Required | Configurable |
|------|----------|---------|----------|--------------|
| 8088 | HTTP | Web Interface | Yes* | Yes |
| 8043 | HTTPS | Secure Web | Recommended | Yes |
| 8060 | SSL/TLS | Gateway Network | If using GAN | Yes |
| 4840 | TCP | OPC UA Server | If using OPC UA | Yes |
| 4096 | TCP | OPC UA Discovery | If using OPC UA | Yes |
| 502 | TCP | Modbus TCP | If using Modbus | Yes |
| 3306 | TCP | MySQL/MariaDB | If using MySQL | Per connection |
| 5432 | TCP | PostgreSQL | If using PostgreSQL | Per connection |
| 1433 | TCP | MS SQL Server | If using MSSQL | Per connection |

*Either HTTP or HTTPS required, both recommended

---

## Related Documentation

- [Network Configuration](https://docs.inductiveautomation.com/docs/8.3/gateway-config/networking)
- [SSL/TLS Setup](https://docs.inductiveautomation.com/docs/8.3/security/ssl-tls-configuration)
- [Gateway Network](https://docs.inductiveautomation.com/docs/8.3/gateway-network)
- [Security Hardening](https://support.inductiveautomation.com/hc/en-us/articles/360047166492)
- [Firewall Configuration](https://support.inductiveautomation.com/hc/en-us/articles/360047040731)

---

*Reference: Ignition 8.3.0 - Network Ports Configuration*
*Configuration File: C:\Program Files\Inductive Automation\Ignition\data\gateway.xml*
*Last Updated: December 12, 2025*