# Gateway Network Configuration

## Network Parameters

```params
module: Gateway Network
protocol: WebSocket/HTTPS
port: 8060
ssl_required: true
compression: enabled
connection_mode: Independent
```

## Gateway Network Overview

The Gateway Network (GAN) enables multiple Ignition gateways to communicate, share data, and distribute functionality across an enterprise architecture.

## Check Gateway Network Status

```python
#!/usr/bin/env python
import os
import json
import socket

def check_gateway_network():
    """Check Gateway Network configuration and connections"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

    print("=== Gateway Network Status ===\n")

    # Check if Gateway Network is configured
    config_path = os.path.join(ignition_root, "data", "gateway-network.xml")
    if os.path.exists(config_path):
        print("[OK] Gateway Network configured")
    else:
        print("[!] Gateway Network not configured")
        return False

    # Check network port availability
    gan_port = 8060
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', gan_port))
    sock.close()

    if result == 0:
        print(f"[OK] GAN port {gan_port} is open")
    else:
        print(f"[!] GAN port {gan_port} is not accessible")

    # Check SSL certificate
    cert_path = os.path.join(ignition_root, "data", "certificates", "gan-ssl.crt")
    if os.path.exists(cert_path):
        print("[OK] SSL certificate found")
    else:
        print("[!] SSL certificate not configured")

    # Check connection status (simulated)
    connections = {
        "Central_Gateway": "Connected",
        "Plant_A_Gateway": "Connected",
        "Plant_B_Gateway": "Disconnected",
        "Edge_Gateway_01": "Connected"
    }

    print("\n=== Gateway Connections ===")
    for gateway, status in connections.items():
        status_icon = "[OK]" if status == "Connected" else "[!]"
        print(f"  {status_icon} {gateway}: {status}")

    return True

if __name__ == "__main__":
    check_gateway_network()
```

## Gateway Network Topology

```python
def define_network_topology():
    """Define Gateway Network architecture patterns"""

    topologies = {
        "Hub and Spoke": {
            "description": "Central gateway with multiple remote gateways",
            "use_case": "Centralized data collection and monitoring",
            "architecture": {
                "central": {
                    "name": "Central_HQ",
                    "role": "Controller",
                    "services": ["Tag History", "Alarm Journal", "Reporting"]
                },
                "spokes": [
                    {
                        "name": "Plant_A",
                        "role": "Remote",
                        "connection": "Outgoing to Central_HQ"
                    },
                    {
                        "name": "Plant_B",
                        "role": "Remote",
                        "connection": "Outgoing to Central_HQ"
                    }
                ]
            }
        },
        "Distributed": {
            "description": "Multiple interconnected gateways",
            "use_case": "Peer-to-peer data sharing",
            "architecture": {
                "gateways": [
                    {
                        "name": "Gateway_1",
                        "connections": ["Gateway_2", "Gateway_3"]
                    },
                    {
                        "name": "Gateway_2",
                        "connections": ["Gateway_1", "Gateway_3"]
                    },
                    {
                        "name": "Gateway_3",
                        "connections": ["Gateway_1", "Gateway_2"]
                    }
                ]
            }
        },
        "Hierarchical": {
            "description": "Multi-tier gateway architecture",
            "use_case": "Enterprise with regional and local gateways",
            "architecture": {
                "enterprise": "Corporate_Gateway",
                "regional": ["Region_North", "Region_South"],
                "local": ["Plant_1", "Plant_2", "Plant_3", "Plant_4"]
            }
        },
        "Edge_to_Cloud": {
            "description": "Edge gateways connected to cloud",
            "use_case": "IIoT and cloud analytics",
            "architecture": {
                "cloud": "Cloud_Gateway",
                "edge": ["Edge_1", "Edge_2", "Edge_3"],
                "protocol": "MQTT Transmission"
            }
        }
    }

    print("=== Gateway Network Topologies ===")
    for name, config in topologies.items():
        print(f"\n{name}:")
        print(f"  Description: {config['description']}")
        print(f"  Use Case: {config['use_case']}")

    return topologies
```

## Gateway Connection Configuration

```python
def configure_gateway_connection():
    """Configure outgoing Gateway Network connection"""

    connection_config = {
        "connection_name": "Plant_To_Central",
        "remote_gateway": {
            "host": "central.company.com",
            "port": 8060,
            "ssl": True
        },
        "authentication": {
            "username": "plant_gateway",
            "password": "{encrypted}",
            "security_zone": "Production"
        },
        "connection_settings": {
            "enabled": True,
            "auto_reconnect": True,
            "reconnect_delay": 10000,  # ms
            "websocket_timeout": 30000,  # ms
            "ping_rate": 5000,  # ms
            "compression": True,
            "http_proxy": None
        },
        "security_settings": {
            "require_ssl": True,
            "verify_hostname": True,
            "accept_untrusted": False,
            "certificate_alias": "gan_cert"
        },
        "services_settings": {
            "enable_remote_tag_provider": True,
            "enable_remote_history": True,
            "enable_remote_alarm_journal": True,
            "enable_gateway_scripts": False,
            "enable_eam": False
        }
    }

    # Connection script
    connection_script = '''
import system

def establish_gan_connection():
    """Establish Gateway Network connection"""

    # Create connection
    result = system.gateway.addOutgoingConnection({
        "Name": "Plant_To_Central",
        "Host": "central.company.com",
        "Port": 8060,
        "UseSSL": True,
        "Username": "plant_gateway",
        "Password": "encrypted_password",
        "Enabled": True
    })

    if result.isSuccess():
        print(f"Gateway connection established")
        return True
    else:
        print(f"Connection failed: {result.getError()}")
        return False
    '''

    return {
        "config": connection_config,
        "script": connection_script
    }
```

## Remote Tag Providers

```python
def configure_remote_tag_providers():
    """Configure remote tag provider access"""

    remote_provider_config = {
        "provider_name": "Remote_Plant_A",
        "source_gateway": "Plant_A_Gateway",
        "settings": {
            "enabled": True,
            "read_only": False,
            "allow_back_fill": True,
            "stale_timeout": 10000,  # ms
            "optimize_writes": True
        },
        "security": {
            "security_zone": "Remote",
            "require_authentication": True,
            "allowed_roles": ["Operator", "Administrator"]
        },
        "performance": {
            "subscription_pace": "Direct",
            "tag_group_rate": 1000,  # ms
            "max_concurrent": 50,
            "cache_size": 10000
        }
    }

    # Remote tag access script
    remote_tag_script = '''
import system

def read_remote_tags():
    """Read tags from remote provider"""

    # Read single remote tag
    value = system.tag.read("[Remote_Plant_A]Line1/Production/Count").value
    print(f"Remote tag value: {value}")

    # Read multiple remote tags
    paths = [
        "[Remote_Plant_A]Line1/Status",
        "[Remote_Plant_A]Line1/Speed",
        "[Remote_Plant_A]Line1/Temperature"
    ]
    values = system.tag.readBlocking(paths)

    for path, value in zip(paths, values):
        print(f"{path}: {value.value} ({value.quality})")

    return values

def write_remote_tag():
    """Write to remote tag"""

    # Write single value
    result = system.tag.write(
        "[Remote_Plant_A]Line1/Setpoint",
        100.0
    )

    if result.isGood():
        print("Remote write successful")
    else:
        print(f"Remote write failed: {result}")

    return result
    '''

    return {
        "config": remote_provider_config,
        "script": remote_tag_script
    }
```

## Remote History Provider

```python
def configure_remote_history():
    """Configure remote history provider access"""

    history_config = {
        "provider_name": "Central_History",
        "source_gateway": "Central_Gateway",
        "settings": {
            "enabled": True,
            "allow_backfill": True,
            "data_pruning": {
                "enabled": True,
                "age_limit": 365,  # days
                "size_limit": 100,  # GB
            },
            "partitioning": "Monthly",
            "compression": True
        },
        "performance": {
            "query_timeout": 30000,  # ms
            "max_query_size": 100000,  # rows
            "cache_queries": True,
            "parallel_queries": 4
        }
    }

    # Remote history query
    history_script = '''
import system

def query_remote_history():
    """Query historical data from remote gateway"""

    # Query history from remote provider
    data = system.tag.queryTagHistory(
        paths=["[Remote_Plant_A]Line1/Production/Count"],
        startDate=system.date.addHours(system.date.now(), -24),
        endDate=system.date.now(),
        returnSize=100,
        aggregationMode="Average",
        intervalHours=1
    )

    # Process results
    for row in range(data.rowCount):
        timestamp = data.getValueAt(row, 0)
        value = data.getValueAt(row, 1)
        print(f"{timestamp}: {value}")

    return data
    '''

    return {
        "config": history_config,
        "script": history_script
    }
```

## Remote Alarm Journal

```python
def configure_remote_alarm_journal():
    """Configure remote alarm journal"""

    journal_config = {
        "profile_name": "Central_Alarm_Journal",
        "gateway_name": "Central_Gateway",
        "settings": {
            "enabled": True,
            "store_forward": True,
            "buffer_size": 1000,
            "pruning": {
                "enabled": True,
                "age_days": 90,
                "max_records": 1000000
            }
        }
    }

    # Query remote alarms
    alarm_script = '''
import system

def query_remote_alarms():
    """Query alarms from remote journal"""

    # Query alarm journal
    alarms = system.alarm.queryJournal(
        startDate=system.date.addDays(system.date.now(), -7),
        endDate=system.date.now(),
        journalName="Central_Alarm_Journal",
        includeData=True,
        includeShelved=False,
        provider=["Remote_Plant_A", "Remote_Plant_B"]
    )

    # Process alarm events
    for alarm in alarms:
        print(f"Alarm: {alarm.displayPath}")
        print(f"  State: {alarm.state}")
        print(f"  Priority: {alarm.priority}")
        print(f"  Time: {alarm.eventTime}")

    return alarms
    '''

    return {
        "config": journal_config,
        "script": alarm_script
    }
```

## Gateway Services

```python
def gateway_network_services():
    """Define available Gateway Network services"""

    services = {
        "Tag Services": {
            "remote_tag_provider": "Access tags from remote gateways",
            "tag_synchronization": "Bi-directional tag sync",
            "tag_history_splitter": "Split history across gateways"
        },
        "Alarm Services": {
            "remote_alarm_journal": "Centralized alarm storage",
            "alarm_notification": "Remote alarm notification",
            "alarm_consolidation": "Aggregate alarms from multiple sources"
        },
        "History Services": {
            "remote_history_provider": "Access remote historical data",
            "history_sink": "Store history on remote gateway",
            "history_sync": "Synchronize historical data"
        },
        "Security Services": {
            "identity_provider": "Centralized authentication",
            "audit_profile": "Central audit logging",
            "security_zones": "Distributed security zones"
        },
        "EAM Services": {
            "agent": "Managed gateway agent",
            "controller": "Central management controller",
            "task_execution": "Remote task execution"
        },
        "Load Balancing": {
            "tag_load_balancing": "Distribute tag load",
            "client_load_balancing": "Balance client connections",
            "history_load_balancing": "Distribute history queries"
        }
    }

    print("=== Gateway Network Services ===")
    for category, items in services.items():
        print(f"\n{category}:")
        for service, description in items.items():
            print(f"  - {service}: {description}")

    return services
```

## Performance Monitoring

```python
def monitor_gateway_network():
    """Monitor Gateway Network performance"""

    monitoring_queries = {
        "connection_status": '''
            SELECT
                gateway_name,
                connection_state,
                last_comm_time,
                ping_time_ms,
                throughput_kbps
            FROM gateway_connections
            WHERE enabled = 1
            ORDER BY gateway_name
        ''',
        "message_metrics": '''
            SELECT
                gateway_name,
                messages_sent,
                messages_received,
                bytes_sent,
                bytes_received,
                errors
            FROM gan_metrics
            WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ''',
        "service_performance": '''
            SELECT
                service_type,
                request_count,
                avg_response_time_ms,
                max_response_time_ms,
                error_rate
            FROM gan_service_metrics
            WHERE timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY service_type
        '''
    }

    monitoring_script = '''
import system

def check_gan_health():
    """Check Gateway Network health"""

    connections = system.gateway.getGatewayConnections()

    for conn in connections:
        print(f"Gateway: {conn.name}")
        print(f"  Status: {conn.status}")
        print(f"  Ping: {conn.pingTime}ms")
        print(f"  Throughput: {conn.throughput}kbps")
        print(f"  Queue Size: {conn.queueSize}")

        if conn.status != "Connected":
            # Alert on disconnection
            system.util.sendMessage(
                "GAN_Monitor",
                "ConnectionLost",
                {"gateway": conn.name}
            )

    return connections
    '''

    return {
        "queries": monitoring_queries,
        "script": monitoring_script
    }
```

## Security Configuration

```python
def gateway_network_security():
    """Configure Gateway Network security"""

    security_config = {
        "ssl_configuration": {
            "enabled": True,
            "port": 8060,
            "keystore": "gateway-keystore.jks",
            "truststore": "gateway-truststore.jks",
            "client_auth": "required",
            "protocols": ["TLSv1.2", "TLSv1.3"],
            "cipher_suites": [
                "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
            ]
        },
        "authentication": {
            "method": "certificate",  # certificate, username/password, or both
            "require_trusted": True,
            "allowed_certificates": [
                "CN=Plant_A_Gateway",
                "CN=Plant_B_Gateway"
            ]
        },
        "firewall_rules": {
            "allow_incoming": ["10.0.0.0/24", "192.168.1.0/24"],
            "deny_incoming": ["0.0.0.0/0"],
            "rate_limiting": {
                "enabled": True,
                "max_connections_per_ip": 10,
                "max_requests_per_second": 100
            }
        },
        "security_zones": {
            "DMZ": ["Gateway_DMZ"],
            "Production": ["Plant_A", "Plant_B"],
            "Corporate": ["HQ_Gateway", "Reporting_Gateway"]
        }
    }

    return security_config
```

## Documentation Links
- [Gateway Network Guide](https://docs.inductiveautomation.com/docs/8.3/gateway-network)
- [Remote Providers](https://docs.inductiveautomation.com/docs/8.3/gateway-network/remote-providers)
- [Gateway Network Security](https://docs.inductiveautomation.com/docs/8.3/gateway-network/security)