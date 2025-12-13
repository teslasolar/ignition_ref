# Module Detailed Descriptions

## Core Platform Modules

### OPC-UA Module
**Purpose:** Foundation for industrial device communication
**Key Features:**
- OPC UA Server and Client implementation
- Device driver framework
- Tag browsing and subscription
- Security with certificates
- Discovery service

**Common Use Cases:**
- Connect to PLCs and industrial devices
- Expose Ignition tags to third-party OPC UA clients
- Bridge between different industrial protocols
- Real-time data acquisition

**Configuration Location:** Gateway → Config → OPC UA
**Documentation:** [OPC UA Guide](https://docs.inductiveautomation.com/docs/8.3/opc-ua)

---

### Perspective Module
**Purpose:** Modern web-based HMI/SCADA visualization
**Key Features:**
- Responsive design for any screen size
- Mobile-first approach
- Component-based architecture
- CSS styling and theming
- Session management
- Real-time data binding

**Common Use Cases:**
- Operator interfaces
- Mobile applications
- Dashboard and reporting displays
- Remote monitoring
- Cross-platform HMI

**Configuration Location:** Designer → Perspective Workspace
**Documentation:** [Perspective Guide](https://docs.inductiveautomation.com/docs/8.3/perspective)

---

### SQL Bridge Module
**Purpose:** Bidirectional database communication
**Key Features:**
- Transaction Groups
- Triggered data logging
- Recipe management
- Database to PLC synchronization
- Historical logging
- Event-driven transactions

**Common Use Cases:**
- Production data logging
- Recipe/batch management
- Database to PLC data transfer
- Event logging
- OEE data collection

**Configuration Location:** Designer → Transaction Groups
**Documentation:** [SQL Bridge Guide](https://docs.inductiveautomation.com/docs/8.3/sql-bridge)

---

### Reporting Module
**Purpose:** Dynamic report generation and distribution
**Key Features:**
- Drag-and-drop report designer
- Dynamic data sources
- Scheduled reports
- Email distribution
- PDF/Excel/HTML export
- Parameterized reports

**Common Use Cases:**
- Production reports
- Compliance documentation
- Batch records
- Alarm summaries
- KPI dashboards

**Configuration Location:** Designer → Reports
**Documentation:** [Reporting Guide](https://docs.inductiveautomation.com/docs/8.3/reporting)

---

## Historian Modules

### Tag Historian Module
**Purpose:** Efficient time-series data storage
**Key Features:**
- Automatic data compression
- Partitioned storage
- Query optimization
- Data pruning policies
- Store and forward
- Multiple storage providers

**Common Use Cases:**
- Process data archiving
- Trend analysis
- Historical playback
- Data analysis
- Compliance logging

**Configuration Location:** Gateway → Config → Tags → History
**Documentation:** [Tag Historian Guide](https://docs.inductiveautomation.com/docs/8.3/tag-historian)

---

### SQL Historian Module
**Purpose:** Store history in external SQL databases
**Key Features:**
- Use existing database infrastructure
- Custom table schemas
- Direct SQL access
- Integration with BI tools

**Common Use Cases:**
- Enterprise data integration
- Custom reporting solutions
- Third-party analytics
- Long-term archival

**Configuration Location:** Gateway → Config → Tags → History Providers
**Documentation:** [SQL Historian Guide](https://docs.inductiveautomation.com/docs/8.3/tag-historian/sql-historian)

---

## Alarm and Notification

### Alarm Notification Module
**Purpose:** Alarm delivery and escalation
**Key Features:**
- Notification pipelines
- Escalation logic
- Acknowledgment tracking
- Multiple delivery methods:
  - Email
  - SMS
  - Voice (with service)
  - Custom scripts

**Common Use Cases:**
- Critical alarm notifications
- On-call escalation
- Alarm acknowledgment
- Audit trail
- Custom notification logic

**Configuration Location:** Gateway → Config → Alarm → Notification
**Documentation:** [Alarm Notification Guide](https://docs.inductiveautomation.com/docs/8.3/alarming/alarm-notification)

---

## Process Control

### Sequential Function Charts (SFC) Module
**Purpose:** Procedural automation and batch control
**Key Features:**
- Graphical programming
- ISA-88 compliance
- Parallel execution
- Exception handling
- Recipe management
- Batch tracking

**Common Use Cases:**
- Batch processing
- Recipe execution
- Procedural automation
- Complex sequences
- State machines

**Configuration Location:** Designer → SFC
**Documentation:** [SFC Guide](https://docs.inductiveautomation.com/docs/8.3/sfc)

---

## PLC/Device Drivers

### Allen-Bradley Driver Suite

#### Logix Driver
**Supports:** ControlLogix, CompactLogix, FlexLogix, SoftLogix
**Protocol:** CIP (EtherNet/IP)
**Features:**
- UDT support
- Array optimization
- Program-scoped tags
- Add-on instruction support

#### Allen-Bradley Drivers (Legacy)
**Supports:** PLC5, SLC500, MicroLogix
**Protocols:** DF1, DH+, Ethernet
**Features:**
- Legacy system support
- Serial communication
- Data Highway Plus

#### Micro800 Driver
**Supports:** Micro820, Micro830, Micro850, Micro870
**Protocol:** CIP
**Features:**
- Cost-effective PLC support
- Global variable access

---

### Siemens Drivers
**Supports:** S7-300, S7-400, S7-1200, S7-1500
**Protocol:** S7 (ISO-on-TCP)
**Features:**
- Optimized block access
- Data block reading
- Multiple connection support

**Common Applications:**
- European manufacturing
- Process industries
- Building automation

---

### Modbus Driver v2
**Supports:** Any Modbus-compliant device
**Protocols:** Modbus TCP, Modbus RTU over TCP
**Features:**
- Coil/register mapping
- Function code support
- Address mapping
- Multiple slave support

**Common Applications:**
- Power monitoring
- HVAC systems
- Generic device integration
- Legacy system integration

---

### Mitsubishi Driver
**Supports:** Q-Series, FX Series
**Protocols:** MC Protocol (3E/4E)
**Features:**
- Device memory access
- Binary and ASCII modes

**Common Applications:**
- Asian manufacturing
- Robotics integration
- Material handling

---

### Omron Driver
**Supports:** NJ Series, NX Series
**Protocol:** FINS/TCP
**Features:**
- Tag-based access
- Structure support
- High-speed communication

**Common Applications:**
- Machine automation
- Motion control
- Safety systems

---

### UDP and TCP Drivers
**Purpose:** Generic socket communication
**Features:**
- Custom protocol implementation
- Raw data access
- Flexible message handling

**Common Applications:**
- Barcode scanners
- Weigh scales
- Custom devices
- Legacy system integration

---

## Database Connectivity

### JDBC Driver Modules

#### Microsoft SQL Server Driver
**Version:** Latest Microsoft JDBC Driver
**Features:**
- Windows Authentication support
- Always Encrypted
- Azure SQL Database support

#### PostgreSQL Driver
**Version:** Latest PostgreSQL JDBC Driver
**Features:**
- Open-source database support
- JSON/JSONB support
- Advanced data types

#### MariaDB Driver
**Version:** Latest MariaDB Connector/J
**Features:**
- MySQL compatibility
- Galera Cluster support
- Connection pooling

---

## Utility Modules

### EventStream Module
**Purpose:** Real-time event broadcasting
**Features:**
- WebSocket streaming
- Event filtering
- Custom event sources
- Third-party integration

**Common Applications:**
- Real-time dashboards
- External system integration
- Event-driven architectures
- Audit streaming

---

## Module Selection Guide

### For Manufacturing Execution
**Essential:** SQL Bridge, Reporting, Perspective
**Recommended:** SFC, Alarm Notification

### For SCADA Systems
**Essential:** OPC-UA, Perspective, Tag Historian
**Recommended:** Alarm Notification, Reporting

### For Data Collection
**Essential:** SQL Bridge, Tag Historian
**Recommended:** Reporting, appropriate drivers

### For Mobile Applications
**Essential:** Perspective
**Recommended:** Alarm Notification

### For Batch Processing
**Essential:** SFC, SQL Bridge
**Recommended:** Reporting, Tag Historian

---

## Performance Considerations

### High-Impact Modules
- **Tag Historian:** Disk I/O intensive
- **Perspective:** Memory for sessions
- **OPC-UA:** CPU for subscriptions

### Low-Impact Modules
- **JDBC Drivers:** Minimal overhead
- **EventStream:** Efficient streaming

### Optimization Tips
1. Disable unused modules
2. Configure appropriate history rates
3. Optimize transaction group triggers
4. Manage Perspective session counts

---

## Module Licensing

### Maker Edition Limitations
- Non-commercial use only
- Limited to 3 clients
- All modules included
- No time limit

### Standard Edition
- Per-module licensing
- Unlimited usage within license
- Annual or perpetual options

### Enterprise Features
- Redundancy support
- Enterprise Administration Module
- Advanced support options

---

*Reference: Ignition 8.3.0 Module Descriptions*
*Documentation: https://docs.inductiveautomation.com/docs/8.3/modules*
*Last Updated: December 12, 2025*