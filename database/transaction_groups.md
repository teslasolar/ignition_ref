# Transaction Group Configurations

## Transaction Parameters

```params
execution_rate: 1000
trigger_mode: timer
store_mode: insert_rows
table_name: production_data
```

## Transaction Group Types

### Standard Group
```python
def create_standard_group():
    '''Create standard transaction group'''
    group = {
        "name": "Production_Logging",
        "enabled": True,
        "mode": "Standard",
        "rate": 60000,  # 1 minute
        "table": "production_log",
        "database": "default",
        "items": [
            {"name": "timestamp", "type": "timestamp"},
            {"name": "machine_id", "source": "[default]Machine/ID"},
            {"name": "production_count", "source": "[default]Machine/Count"},
            {"name": "efficiency", "source": "[default]Machine/OEE"}
        ]
    }
    return group
```

### Block Group
```python
def create_block_group():
    '''Create block transaction group'''
    group = {
        "name": "Machine_Status_Block",
        "enabled": True,
        "mode": "Block",
        "rate": 5000,  # 5 seconds
        "block_size": 10,
        "table": "machine_status",
        "items": [
            {"name": "block_timestamp", "type": "timestamp"},
            {"name": "values", "source": "[default]Machine/Status/*"}
        ]
    }
    return group
```

### Historical Group
```python
def create_historical_group():
    '''Create historical transaction group'''
    group = {
        "name": "Historical_Trending",
        "enabled": True,
        "mode": "Historical",
        "rate": 10000,  # 10 seconds
        "table": "historical_data",
        "handshake": {
            "enabled": True,
            "tag": "[default]Trigger/DataReady",
            "reset_value": 0
        }
    }
    return group
```

## Documentation Links
- [Transaction Groups](https://docs.inductiveautomation.com/docs/8.3/transaction-groups)
