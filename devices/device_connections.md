# Device Connection Configurations

## Device Parameters

```params
scan_rate: 1000
timeout: 5000
max_connections: 10
reconnect_delay: 30000
```

## Configured Devices

### Current Status
- [OK] OPC UA Server configured
- [OK] Modbus devices: 3 configured
- [OK] Simulator device active
- [!] Allen-Bradley driver not configured

## OPC UA Connection Template

```python
def configure_opcua_device():
    '''Configure OPC UA device connection'''
    device = {
        "name": "OPC_UA_Server",
        "driver": "OPC-UA",
        "enabled": True,
        "settings": {
            "endpoint": "opc.tcp://localhost:4840",
            "security_policy": "None",
            "message_mode": "SignAndEncrypt",
            "username": "",
            "password": "",
            "connection_timeout": 5000,
            "request_timeout": 5000
        }
    }
    return device
```

## Modbus TCP Configuration

```python
def configure_modbus_tcp():
    '''Configure Modbus TCP device'''
    device = {
        "name": "Modbus_PLC",
        "driver": "Modbus TCP",
        "enabled": True,
        "settings": {
            "hostname": "192.168.1.100",
            "port": 502,
            "unit_id": 1,
            "timeout": 3000,
            "reconnect_after": 10000,
            "max_holding_registers": 125,
            "max_input_registers": 125,
            "reverse_word_order": False
        }
    }
    return device
```

## Documentation Links
- [Device Connections](https://docs.inductiveautomation.com/docs/8.3/device-connections)
- [OPC UA Configuration](https://docs.inductiveautomation.com/docs/8.3/opc-ua)
- [Modbus Driver](https://docs.inductiveautomation.com/docs/8.3/modbus-driver)
