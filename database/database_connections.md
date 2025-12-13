# Database Connections and Drivers

## Database Parameters

```params
config_db: C:\Program Files\Inductive Automation\Ignition\data\db\config.idb
jdbc_dir: C:\Program Files\Inductive Automation\Ignition\user-lib\jdbc
default_datasource: default
pool_size: 8
validation_query: SELECT 1
```

## Check Database Connections

```python
#!/usr/bin/env python
import sqlite3
import os
import json

ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

def check_database_connections():
    """Check configured database connections"""
    print("=== Database Connections Check ===\n")

    config_db = os.path.join(ignition_root, "data", "db", "config.idb")

    if os.path.exists(config_db):
        try:
            conn = sqlite3.connect(config_db)
            cursor = conn.cursor()

            # Check for datasource tables
            cursor.execute("""
                SELECT name FROM sqlite_master
                WHERE type='table' AND name LIKE '%datasource%'
            """)
            tables = cursor.fetchall()

            if tables:
                print(f"✓ Database configuration found")
                for table in tables:
                    cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                    count = cursor.fetchone()[0]
                    print(f"  {table[0]}: {count} entries")

            conn.close()
        except Exception as e:
            print(f"Error checking database: {e}")
    else:
        print("✗ Configuration database not found")

    # Check JDBC drivers
    jdbc_dir = os.path.join(ignition_root, "user-lib", "jdbc")
    if os.path.exists(jdbc_dir):
        drivers = [f for f in os.listdir(jdbc_dir) if f.endswith('.jar')]
        print(f"\n✓ JDBC Drivers: {len(drivers)} found")
        for driver in drivers:
            size_mb = os.path.getsize(os.path.join(jdbc_dir, driver)) / (1024*1024)
            print(f"  {driver}: {size_mb:.2f} MB")
    else:
        print("\n! No JDBC drivers directory")

def get_connection_pools():
    """Get connection pool configuration"""
    print("\n=== Connection Pool Settings ===")

    pool_config = {
        "Min Pool Size": 0,
        "Max Pool Size": 8,
        "Max Idle": 8,
        "Max Wait": 5000,  # ms
        "Validation Query": "SELECT 1",
        "Test On Borrow": True,
        "Test While Idle": True,
        "Eviction Time": 60000  # ms
    }

    for key, value in pool_config.items():
        print(f"  {key}: {value}")

    return pool_config

if __name__ == "__main__":
    check_database_connections()
    get_connection_pools()
```

## Database Driver Configuration

### Supported Databases

```python
def get_database_drivers():
    """Get supported database driver configurations"""
    drivers = {
        "MySQL": {
            "driver_class": "com.mysql.cj.jdbc.Driver",
            "url_format": "jdbc:mysql://{host}:{port}/{database}",
            "default_port": 3306,
            "module": "MySQL JDBC Driver",
            "validation_query": "SELECT 1"
        },
        "PostgreSQL": {
            "driver_class": "org.postgresql.Driver",
            "url_format": "jdbc:postgresql://{host}:{port}/{database}",
            "default_port": 5432,
            "module": "PostgreSQL JDBC Driver",
            "validation_query": "SELECT 1"
        },
        "Microsoft SQL Server": {
            "driver_class": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
            "url_format": "jdbc:sqlserver://{host}:{port};databaseName={database}",
            "default_port": 1433,
            "module": "MSSQL JDBC Driver",
            "validation_query": "SELECT 1"
        },
        "Oracle": {
            "driver_class": "oracle.jdbc.driver.OracleDriver",
            "url_format": "jdbc:oracle:thin:@{host}:{port}:{sid}",
            "default_port": 1521,
            "module": "Oracle JDBC Driver",
            "validation_query": "SELECT 1 FROM DUAL"
        },
        "MariaDB": {
            "driver_class": "org.mariadb.jdbc.Driver",
            "url_format": "jdbc:mariadb://{host}:{port}/{database}",
            "default_port": 3306,
            "module": "MariaDB JDBC Driver",
            "validation_query": "SELECT 1"
        }
    }

    print("=== Supported Database Drivers ===\n")
    for db_name, config in drivers.items():
        print(f"{db_name}:")
        print(f"  Port: {config['default_port']}")
        print(f"  Module: {config['module']}")
        print(f"  Validation: {config['validation_query']}")
        print()

    return drivers

get_database_drivers()
```

## Connection String Templates

### MySQL/MariaDB
```python
def mysql_connection():
    """MySQL connection configuration"""
    config = {
        "name": "MySQL_Production",
        "driver": "MySQL",
        "connect_url": "jdbc:mysql://localhost:3306/ignition",
        "username": "ignition_user",
        "password": "{encrypted}",
        "extra_params": {
            "zeroDateTimeBehavior": "convertToNull",
            "useSSL": "false",
            "serverTimezone": "UTC",
            "allowPublicKeyRetrieval": "true"
        }
    }

    # Build full URL
    url = config["connect_url"]
    params = "&".join([f"{k}={v}" for k, v in config["extra_params"].items()])
    full_url = f"{url}?{params}"

    print(f"MySQL Connection URL:\n{full_url}")
    return config
```

### PostgreSQL
```python
def postgresql_connection():
    """PostgreSQL connection configuration"""
    config = {
        "name": "PostgreSQL_Production",
        "driver": "PostgreSQL",
        "connect_url": "jdbc:postgresql://localhost:5432/ignition",
        "username": "ignition_user",
        "schema": "public",
        "extra_params": {
            "ssl": "false",
            "sslmode": "prefer",
            "currentSchema": "public"
        }
    }

    return config
```

### SQL Server
```python
def sqlserver_connection():
    """SQL Server connection configuration"""
    config = {
        "name": "SQLServer_Production",
        "driver": "Microsoft SQL Server",
        "connect_url": "jdbc:sqlserver://localhost:1433;databaseName=ignition",
        "username": "ignition_user",
        "extra_params": {
            "integratedSecurity": "false",
            "encrypt": "false",
            "trustServerCertificate": "true"
        }
    }

    return config
```

## Store and Forward Configuration

```python
def check_store_forward():
    """Check store and forward settings"""
    print("=== Store & Forward Configuration ===\n")

    sf_config = {
        "enabled": True,
        "buffer_size": 10000,  # records
        "disk_cache_enabled": True,
        "disk_cache_size": 100,  # MB
        "memory_buffer_size": 1000,  # records
        "forward_rate": 100,  # records/sec
        "quarantine_enabled": True,
        "quarantine_size": 1000  # records
    }

    for key, value in sf_config.items():
        print(f"  {key}: {value}")

    # Check cache directory
    cache_dir = os.path.join(ignition_root, "data", "datacache")
    if os.path.exists(cache_dir):
        files = os.listdir(cache_dir)
        print(f"\n✓ Data cache directory: {len(files)} files")

        # Calculate cache size
        total_size = sum(os.path.getsize(os.path.join(cache_dir, f))
                        for f in files)
        print(f"  Cache size: {total_size / (1024*1024):.2f} MB")
    else:
        print("\n! No data cache directory")

    return sf_config
```

## Query Performance Optimization

```python
def optimize_queries():
    """Query optimization recommendations"""
    print("=== Query Optimization Tips ===\n")

    optimizations = {
        "Use Named Queries": "Parameterized, cached, reusable",
        "Enable Query Caching": "Cache frequently used queries",
        "Use Proper Indexes": "Index columns used in WHERE/JOIN",
        "Limit Result Sets": "Use LIMIT/TOP clauses",
        "Avoid SELECT *": "Select only needed columns",
        "Use Connection Pooling": "Reuse database connections",
        "Monitor Slow Queries": "Log queries > 1 second",
        "Batch Operations": "Use transaction groups for bulk ops"
    }

    for tip, description in optimizations.items():
        print(f"• {tip}")
        print(f"  {description}")
        print()
```

## Named Queries

```python
def create_named_query():
    """Create a named query template"""
    query = {
        "name": "GetProductionData",
        "type": "Query",
        "database": "default",
        "caching": {
            "enabled": True,
            "timeout": 60  # seconds
        },
        "query": """
            SELECT
                timestamp,
                tag_path,
                value,
                quality
            FROM production_data
            WHERE timestamp BETWEEN :startDate AND :endDate
                AND area = :area
            ORDER BY timestamp DESC
            LIMIT :limit
        """,
        "parameters": [
            {"name": "startDate", "type": "DateTime"},
            {"name": "endDate", "type": "DateTime"},
            {"name": "area", "type": "String"},
            {"name": "limit", "type": "Integer", "default": 1000}
        ]
    }

    print("Named Query Template:")
    print(json.dumps(query, indent=2))
    return query
```

## Database Security

```python
def database_security_check():
    """Check database security settings"""
    print("=== Database Security Checklist ===\n")

    security_checks = [
        ("Use SSL/TLS connections", "encrypt=true"),
        ("Separate read/write users", "Principle of least privilege"),
        ("Encrypt sensitive data", "Use Gateway encryption"),
        ("Audit database access", "Enable audit logging"),
        ("Use connection validation", "validationQuery configured"),
        ("Set connection timeouts", "Prevent hanging connections"),
        ("Restrict database permissions", "GRANT only needed permissions"),
        ("Regular password rotation", "Update quarterly")
    ]

    for check, recommendation in security_checks:
        print(f"☐ {check}")
        print(f"  → {recommendation}")
        print()
```

## Failover Configuration

```python
def configure_failover():
    """Database failover configuration"""
    failover = {
        "primary_host": "db-primary.company.com",
        "secondary_host": "db-secondary.company.com",
        "failover_enabled": True,
        "failover_mode": "Automatic",
        "retry_count": 3,
        "retry_delay": 5000,  # ms
        "health_check_interval": 30000  # ms
    }

    print("Failover Configuration:")
    for key, value in failover.items():
        print(f"  {key}: {value}")

    return failover
```

## Documentation Links
- [Database Connections](https://docs.inductiveautomation.com/docs/8.3/databases)
- [Named Queries](https://docs.inductiveautomation.com/docs/8.3/databases/named-queries)
- [Store and Forward](https://docs.inductiveautomation.com/docs/8.3/databases/store-and-forward)