# Reporting Module Configuration

## Module Parameters

```params
module: Reporting
version: 8.3.0
format_types: PDF,HTML,CSV,RTF,JPEG,PNG
scheduling: enabled
email_delivery: enabled
print_direct: enabled
```

## Reporting Module Overview

The Reporting module provides dynamic report generation with data from databases, tags, and scripts. Reports can be scheduled, emailed, saved, or printed automatically.

## Check Reporting Module Status

```python
#!/usr/bin/env python
import os
import json
import glob

def check_reporting_module():
    """Check Reporting module installation and configuration"""
    ignition_root = r"C:\Program Files\Inductive Automation\Ignition"

    print("=== Reporting Module Status ===\n")

    # Check module installation
    modules_dir = os.path.join(ignition_root, "data", "modules")
    if os.path.exists(modules_dir):
        reporting_modules = [f for f in os.listdir(modules_dir)
                            if 'reporting' in f.lower()]
        if reporting_modules:
            print(f"[OK] Reporting module found: {reporting_modules}")
        else:
            print("[!] Reporting module not installed")

    # Check for report resources
    projects_dir = os.path.join(ignition_root, "data", "projects")
    if os.path.exists(projects_dir):
        report_count = 0
        for project in os.listdir(projects_dir):
            reports_path = os.path.join(projects_dir, project, "ignition", "reports")
            if os.path.exists(reports_path):
                reports = glob.glob(os.path.join(reports_path, "*.json"))
                report_count += len(reports)
                if reports:
                    print(f"  Project '{project}': {len(reports)} reports")

        print(f"\nTotal reports found: {report_count}")

    return True

if __name__ == "__main__":
    check_reporting_module()
```

## Report Data Sources

```python
def configure_report_datasources():
    """Configure data sources for reports"""

    datasources = {
        "SQL Query": {
            "type": "sql",
            "query": """
                SELECT
                    timestamp,
                    machine_name,
                    production_count,
                    efficiency,
                    downtime_minutes
                FROM production_data
                WHERE timestamp BETWEEN ? AND ?
                ORDER BY timestamp DESC
            """,
            "parameters": ["StartDate", "EndDate"],
            "database": "default"
        },
        "Tag Historian": {
            "type": "tag_history",
            "paths": [
                "[default]Line1/OEE",
                "[default]Line1/ProductionRate",
                "[default]Line1/Quality"
            ],
            "aggregation": "Average",
            "interval": "1 hour",
            "parameters": ["StartDate", "EndDate"]
        },
        "Tag Report": {
            "type": "tag",
            "paths": [
                "[default]Overview/TotalProduction",
                "[default]Overview/ActiveAlarms",
                "[default]Overview/SystemStatus"
            ],
            "polling_rate": "Now"
        },
        "Script": {
            "type": "script",
            "script": '''
def updateData(data, sample):
    """Generate calculated data for report"""
    import system

    # Get parameters
    start_date = data['StartDate']
    end_date = data['EndDate']

    # Calculate KPIs
    production = system.db.runPrepQuery(
        "SELECT SUM(count) FROM production WHERE timestamp BETWEEN ? AND ?",
        [start_date, end_date]
    )

    # Add to data map
    data['TotalProduction'] = production.getValueAt(0, 0)
    data['ReportGenerated'] = system.date.now()

    return data
            '''
        },
        "Nested Query": {
            "type": "nested",
            "parent_key": "machine_id",
            "child_query": """
                SELECT * FROM machine_details
                WHERE machine_id = ?
            """,
            "return_format": "json"
        }
    }

    print("Report Data Sources Configured:")
    for name, config in datasources.items():
        print(f"  {name}: {config['type']}")

    return datasources
```

## Report Design Components

```python
def report_design_elements():
    """Report designer component types"""

    components = {
        "Static Elements": {
            "Static Text": "Fixed text labels and titles",
            "Static Image": "Logos and fixed graphics",
            "Static Shape": "Lines, rectangles, circles",
            "Page Break": "Force new page",
            "Static CSV": "Import CSV data"
        },
        "Data Elements": {
            "Table": "Display tabular data",
            "Table Group": "Grouped data with headers/footers",
            "Simple Table": "Basic data grid",
            "Crosstab": "Pivot table display",
            "Details Panel": "Repeating detail records"
        },
        "Charts": {
            "XY Chart": "Line and scatter plots",
            "Bar Chart": "Vertical/horizontal bars",
            "Pie Chart": "Proportional data",
            "Sparkline": "Inline trend charts",
            "Time Series Chart": "Historical trends",
            "Gauge": "Analog meter display"
        },
        "Dynamic Elements": {
            "Text": "Dynamic text with parameters",
            "Image": "Dynamic images from database/URL",
            "Barcode": "1D/2D barcodes (QR, Code128, etc.)",
            "Rich Text": "HTML formatted text",
            "Subreport": "Embedded child reports"
        },
        "Layout": {
            "Row": "Horizontal container",
            "Column": "Vertical container",
            "Spacer": "Empty space",
            "Container": "Group elements"
        }
    }

    print("=== Report Designer Components ===")
    for category, items in components.items():
        print(f"\n{category}:")
        for name, description in items.items():
            print(f"  - {name}: {description}")

    return components
```

## Report Parameters

```python
def configure_report_parameters():
    """Configure report parameters"""

    parameters = {
        "StartDate": {
            "type": "Date",
            "default": "dateArithmetic(now(), -7, 'days')",
            "required": True,
            "prompt": "Select Start Date"
        },
        "EndDate": {
            "type": "Date",
            "default": "now()",
            "required": True,
            "prompt": "Select End Date"
        },
        "Department": {
            "type": "String",
            "default": "All",
            "options": ["All", "Production", "Quality", "Maintenance"],
            "required": False,
            "prompt": "Select Department"
        },
        "ReportFormat": {
            "type": "String",
            "default": "PDF",
            "options": ["PDF", "Excel", "CSV", "HTML"],
            "required": True,
            "hidden": False
        },
        "IncludeCharts": {
            "type": "Boolean",
            "default": True,
            "prompt": "Include Charts?"
        },
        "EmailRecipients": {
            "type": "String",
            "default": "",
            "required": False,
            "prompt": "Email Recipients (comma separated)"
        }
    }

    # Parameter validation script
    validation_script = '''
def validateParameters(params):
    """Validate report parameters"""
    import system

    start = params.get('StartDate')
    end = params.get('EndDate')

    # Check date range
    if system.date.isAfter(start, end):
        raise ValueError("Start date must be before end date")

    # Check maximum range (365 days)
    days = system.date.daysBetween(start, end)
    if days > 365:
        raise ValueError("Date range cannot exceed 365 days")

    return True
    '''

    return {
        "parameters": parameters,
        "validation": validation_script
    }
```

## Report Scheduling

```python
def configure_report_scheduling():
    """Configure automatic report generation"""

    schedules = {
        "Daily Production Report": {
            "report_path": "Production/DailyReport",
            "schedule_type": "daily",
            "time": "06:00:00",
            "enabled": True,
            "parameters": {
                "StartDate": "midnight(-1)",
                "EndDate": "midnight(0)"
            },
            "actions": {
                "save": {
                    "enabled": True,
                    "path": "C:/Reports/Daily/",
                    "filename": "Production_{date:yyyyMMdd}.pdf",
                    "format": "PDF"
                },
                "email": {
                    "enabled": True,
                    "to": ["production@company.com", "manager@company.com"],
                    "subject": "Daily Production Report - {date}",
                    "body": "Please find attached the daily production report.",
                    "attach_report": True
                },
                "print": {
                    "enabled": False,
                    "printer": "Production_Printer_01"
                }
            }
        },
        "Weekly Summary": {
            "report_path": "Management/WeeklySummary",
            "schedule_type": "weekly",
            "day_of_week": "Monday",
            "time": "08:00:00",
            "enabled": True,
            "parameters": {
                "StartDate": "dateArithmetic(now(), -7, 'days')",
                "EndDate": "now()"
            }
        },
        "Monthly KPI Report": {
            "report_path": "KPI/MonthlyReport",
            "schedule_type": "monthly",
            "day_of_month": 1,
            "time": "00:00:00",
            "enabled": True,
            "parameters": {
                "StartDate": "monthStart(-1)",
                "EndDate": "monthEnd(-1)"
            }
        }
    }

    print("Report Schedules Configured:")
    for name, config in schedules.items():
        print(f"  {name}: {config['schedule_type']} at {config['time']}")

    return schedules
```

## Report Generation Scripts

```python
def generate_report_programmatically():
    """Generate reports via scripting"""

    # Execute report immediately
    execute_script = '''
import system

# Generate report and get bytes
report_bytes = system.report.executeReport(
    path="Production/ShiftReport",
    project="MyProject",
    parameters={
        "StartDate": system.date.getDate(2024, 0, 1),
        "EndDate": system.date.now(),
        "Shift": "Day"
    },
    fileType="pdf"
)

# Save to file
system.file.writeFile(
    "C:/Reports/shift_report.pdf",
    report_bytes
)

# Email report
system.report.executeAndDistribute(
    path="Production/ShiftReport",
    project="MyProject",
    parameters={"Shift": "Day"},
    action="email",
    actionSettings={
        "to": ["supervisor@company.com"],
        "subject": "Shift Report",
        "body": "Attached is the shift report",
        "smtpServerName": "EmailProfile"
    },
    fileType="pdf"
)
    '''

    # Get report list
    list_script = '''
import system

# Get all reports in project
reports = system.report.getReportNamesAsList("MyProject")
for report in reports:
    print(f"Report: {report}")

# Get report parameters
params = system.report.getReportParameters(
    "Production/ShiftReport",
    "MyProject"
)
for param in params:
    print(f"Parameter: {param}")
    '''

    return {
        "execute": execute_script,
        "list": list_script
    }
```

## Report Templates

```python
def create_report_template():
    """Create standard report template"""

    template = {
        "name": "StandardProductionReport",
        "page_size": "Letter",
        "orientation": "Portrait",
        "margins": {
            "top": 0.5,
            "bottom": 0.5,
            "left": 0.5,
            "right": 0.5
        },
        "sections": {
            "header": {
                "height": 1.5,
                "components": [
                    {
                        "type": "image",
                        "path": "logo.png",
                        "position": {"x": 0, "y": 0, "width": 2, "height": 1}
                    },
                    {
                        "type": "text",
                        "value": "Production Report",
                        "font": {"size": 18, "bold": True},
                        "position": {"x": 2.5, "y": 0.25, "width": 3, "height": 0.5}
                    },
                    {
                        "type": "text",
                        "value": "@ReportDate@",
                        "position": {"x": 6, "y": 0.5, "width": 2, "height": 0.25}
                    }
                ]
            },
            "body": {
                "components": [
                    {
                        "type": "table",
                        "datasource": "ProductionData",
                        "columns": [
                            {"key": "timestamp", "header": "Time", "width": 1.5},
                            {"key": "machine", "header": "Machine", "width": 1.5},
                            {"key": "product", "header": "Product", "width": 2},
                            {"key": "quantity", "header": "Quantity", "width": 1},
                            {"key": "quality", "header": "Quality %", "width": 1}
                        ]
                    },
                    {
                        "type": "chart",
                        "datasource": "TrendData",
                        "chart_type": "line",
                        "position": {"x": 0, "y": 4, "width": 7.5, "height": 3}
                    }
                ]
            },
            "footer": {
                "height": 0.5,
                "components": [
                    {
                        "type": "text",
                        "value": "Page @PageNumber@ of @PageTotal@",
                        "align": "center"
                    }
                ]
            }
        }
    }

    return template
```

## Report Distribution

```python
def configure_report_distribution():
    """Configure report distribution methods"""

    distribution = {
        "Email": {
            "smtp_profile": "Default",
            "from_address": "reports@company.com",
            "reply_to": "noreply@company.com",
            "attachment_name": "Report_{date}.pdf",
            "compress": True,
            "encryption": "None"
        },
        "FTP": {
            "enabled": True,
            "server": "ftp.company.com",
            "port": 21,
            "username": "reports",
            "directory": "/reports/daily/",
            "filename_pattern": "Report_%Y%m%d_%H%M%S.pdf"
        },
        "Network Share": {
            "enabled": True,
            "path": "\\\\fileserver\\reports\\",
            "create_date_folders": True,
            "retention_days": 90
        },
        "Database": {
            "enabled": False,
            "table": "report_archive",
            "blob_column": "report_data",
            "metadata_columns": {
                "report_name": "String",
                "generated_date": "DateTime",
                "parameters": "JSON",
                "file_size": "Integer"
            }
        }
    }

    print("Report Distribution Methods:")
    for method, config in distribution.items():
        status = "[OK]" if config.get("enabled", True) else "[!]"
        print(f"  {status} {method}")

    return distribution
```

## Performance Optimization

```python
def report_performance_tips():
    """Report generation performance optimization"""

    optimizations = {
        "Data Source": {
            "use_stored_procedures": "Faster than inline SQL",
            "limit_data_rows": "Use WHERE clauses and LIMIT",
            "cache_static_data": "Cache unchanging lookup data",
            "optimize_queries": "Use indexes and query plans"
        },
        "Report Design": {
            "minimize_subreports": "Each adds processing overhead",
            "optimize_images": "Compress and resize appropriately",
            "limit_nested_groups": "Maximum 3-4 levels",
            "use_simple_expressions": "Complex calculations in SQL"
        },
        "Scheduling": {
            "off_peak_generation": "Schedule during low-usage times",
            "stagger_schedules": "Avoid simultaneous generation",
            "pre_generate_common": "Cache frequently used reports",
            "async_generation": "Use queuing for large reports"
        }
    }

    return optimizations
```

## Documentation Links
- [Reporting Module](https://docs.inductiveautomation.com/docs/8.3/reporting)
- [Report Designer](https://docs.inductiveautomation.com/docs/8.3/reporting/report-designer)
- [Report Scheduling](https://docs.inductiveautomation.com/docs/8.3/reporting/scheduling)