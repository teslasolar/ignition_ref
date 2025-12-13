# WebDev REST API Endpoints

## API Parameters

```params
base_url: /system/webdev/project
auth_type: basic
content_type: application/json
rate_limit: 100
timeout: 30000
```

## REST Endpoint Configuration

### GET Endpoints

```python
def doGet(request, session):
    """Handle GET requests for data retrieval"""
    import system
    import json

    # Parse request path and parameters
    path = request.get("remainingPath")
    params = request.get("params")

    # Route to appropriate handler
    if path.startswith("/api/v1/tags"):
        return handle_tag_read(params)
    elif path.startswith("/api/v1/alarms"):
        return handle_alarm_query(params)
    elif path.startswith("/api/v1/history"):
        return handle_history_query(params)
    elif path.startswith("/api/v1/status"):
        return handle_status_check()
    else:
        return error_response(404, "Endpoint not found")

def handle_tag_read(params):
    """Read tag values via API"""
    import system
    import json

    tag_paths = params.get("paths", "").split(",")

    if not tag_paths or tag_paths == [""]:
        return error_response(400, "No tag paths provided")

    try:
        # Read tag values
        values = system.tag.readBlocking(tag_paths)

        result = []
        for path, value in zip(tag_paths, values):
            result.append({
                "path": path,
                "value": value.value,
                "quality": str(value.quality),
                "timestamp": str(value.timestamp)
            })

        return success_response(result)

    except Exception as e:
        return error_response(500, str(e))

def handle_alarm_query(params):
    """Query alarm status via API"""
    import system
    import json

    state = params.get("state", "ActiveUnacked").split(",")
    priority = params.get("priority", "*").split(",")
    path = params.get("path", "*")

    try:
        alarms = system.alarm.queryStatus(
            path=[path],
            state=state
        )

        result = []
        for alarm in alarms:
            if priority == ["*"] or str(alarm.priority) in priority:
                result.append({
                    "name": alarm.name,
                    "displayPath": alarm.displayPath,
                    "priority": alarm.priority,
                    "state": alarm.state.name,
                    "activeTime": str(alarm.activeTime),
                    "value": alarm.value
                })

        return success_response(result)

    except Exception as e:
        return error_response(500, str(e))

def handle_history_query(params):
    """Query tag history via API"""
    import system
    import json

    paths = params.get("paths", "").split(",")
    start = params.get("start", "now(-1h)")
    end = params.get("end", "now()")
    interval = params.get("interval", "1m")

    if not paths or paths == [""]:
        return error_response(400, "No tag paths provided")

    try:
        # Parse dates
        start_date = system.date.parse(start) if not start.startswith("now") else eval(f"system.date.{start}")
        end_date = system.date.parse(end) if not end.startswith("now") else eval(f"system.date.{end}")

        # Query history
        dataset = system.tag.queryTagHistory(
            paths=paths,
            startDate=start_date,
            endDate=end_date,
            returnSize=0,
            aggregationMode="Average",
            intervalMinutes=int(interval.replace("m", ""))
        )

        # Convert to JSON-friendly format
        result = {
            "columns": list(dataset.columnNames),
            "data": []
        }

        for row in range(dataset.rowCount):
            row_data = []
            for col in range(dataset.columnCount):
                value = dataset.getValueAt(row, col)
                row_data.append(str(value) if value is not None else None)
            result["data"].append(row_data)

        return success_response(result)

    except Exception as e:
        return error_response(500, str(e))

def handle_status_check():
    """System status check endpoint"""
    import system

    status = {
        "gateway": "online",
        "timestamp": str(system.date.now()),
        "version": system.util.getVersion(),
        "uptime": system.util.getUptimeSeconds(),
        "memory": {
            "used": system.util.getMemoryUsage(),
            "max": system.util.getMaxMemory()
        },
        "projects": system.util.getProjectNames()
    }

    return success_response(status)
```

### POST Endpoints

```python
def doPost(request, session):
    """Handle POST requests for data writing"""
    import system
    import json

    # Parse request
    path = request.get("remainingPath")
    body = request.get("data")

    try:
        data = json.loads(body) if body else {}
    except:
        return error_response(400, "Invalid JSON body")

    # Route to appropriate handler
    if path.startswith("/api/v1/tags/write"):
        return handle_tag_write(data)
    elif path.startswith("/api/v1/alarms/acknowledge"):
        return handle_alarm_acknowledge(data)
    elif path.startswith("/api/v1/data/insert"):
        return handle_data_insert(data)
    elif path.startswith("/api/v1/execute"):
        return handle_script_execute(data)
    else:
        return error_response(404, "Endpoint not found")

def handle_tag_write(data):
    """Write tag values via API"""
    import system

    writes = data.get("writes", [])

    if not writes:
        return error_response(400, "No write operations provided")

    paths = []
    values = []

    for write in writes:
        if "path" in write and "value" in write:
            paths.append(write["path"])
            values.append(write["value"])

    if not paths:
        return error_response(400, "Invalid write format")

    try:
        results = system.tag.writeBlocking(paths, values)

        response = []
        for path, result in zip(paths, results):
            response.append({
                "path": path,
                "success": result.isGood(),
                "quality": str(result)
            })

        return success_response(response)

    except Exception as e:
        return error_response(500, str(e))

def handle_alarm_acknowledge(data):
    """Acknowledge alarms via API"""
    import system

    paths = data.get("paths", [])
    notes = data.get("notes", "Acknowledged via API")
    username = data.get("username", "API User")

    if not paths:
        return error_response(400, "No alarm paths provided")

    try:
        system.alarm.acknowledge(paths, notes)

        # Log the acknowledgment
        for path in paths:
            system.util.audit(
                action="ALARM_ACK",
                actionTarget=path,
                actionValue=notes,
                actor=username
            )

        return success_response({
            "acknowledged": len(paths),
            "paths": paths
        })

    except Exception as e:
        return error_response(500, str(e))

def handle_data_insert(data):
    """Insert data into database via API"""
    import system

    table = data.get("table")
    rows = data.get("rows", [])
    database = data.get("database", "default")

    if not table or not rows:
        return error_response(400, "Table and rows required")

    try:
        # Build insert query
        if rows:
            columns = list(rows[0].keys())
            placeholders = ", ".join(["?"] * len(columns))
            column_list = ", ".join(columns)

            query = f"INSERT INTO {table} ({column_list}) VALUES ({placeholders})"

            # Prepare batch data
            batch_data = [[row.get(col) for col in columns] for row in rows]

            # Execute batch insert
            system.db.runPrepBatch(query, batch_data, database)

            return success_response({
                "inserted": len(rows),
                "table": table
            })

    except Exception as e:
        return error_response(500, str(e))
```

### Authentication & Security

```python
def authenticate_request(request):
    """Authenticate API request"""
    import system
    import base64

    # Check for API key in header
    api_key = request.get("headers").get("X-API-Key")

    if api_key:
        # Validate API key
        valid_keys = system.db.runNamedQuery("GetValidAPIKeys")

        for row in range(valid_keys.rowCount):
            if api_key == valid_keys.getValueAt(row, "key"):
                return {
                    "authenticated": True,
                    "user": valid_keys.getValueAt(row, "user"),
                    "permissions": valid_keys.getValueAt(row, "permissions")
                }

    # Check for Basic Auth
    auth_header = request.get("headers").get("Authorization", "")

    if auth_header.startswith("Basic "):
        # Decode credentials
        encoded = auth_header.replace("Basic ", "")
        decoded = base64.b64decode(encoded).decode("utf-8")
        username, password = decoded.split(":", 1)

        # Validate credentials
        if system.security.validateUser(username, password):
            return {
                "authenticated": True,
                "user": username,
                "permissions": system.security.getUserRoles(username)
            }

    return {"authenticated": False}

def check_permissions(auth_info, required_permission):
    """Check if user has required permission"""
    if not auth_info.get("authenticated"):
        return False

    permissions = auth_info.get("permissions", [])

    # Check if user has required permission
    return required_permission in permissions or "admin" in permissions
```

### Response Helpers

```python
def success_response(data, status_code=200):
    """Generate success response"""
    import json

    return {
        "status": status_code,
        "content": json.dumps({
            "success": True,
            "data": data,
            "timestamp": str(system.date.now())
        }),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }

def error_response(status_code, message):
    """Generate error response"""
    import json

    return {
        "status": status_code,
        "content": json.dumps({
            "success": False,
            "error": message,
            "timestamp": str(system.date.now())
        }),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
```

### Rate Limiting

```python
def implement_rate_limiting():
    """Implement API rate limiting"""

    rate_limit_config = {
        "enabled": True,
        "window": 60,  # seconds
        "max_requests": 100,
        "storage": "memory",  # or "database"
        "script": '''
import system

def check_rate_limit(client_id):
    """Check if client has exceeded rate limit"""

    # Get current timestamp
    now = system.date.now()
    window_start = system.date.addSeconds(now, -60)

    # Query request count from memory or database
    if storage == "memory":
        # Use gateway memory tags
        count_tag = f"[default]API/RateLimit/{client_id}/count"
        window_tag = f"[default]API/RateLimit/{client_id}/window"

        tags = system.tag.readBlocking([count_tag, window_tag])
        count = tags[0].value or 0
        last_window = tags[1].value

        # Reset if new window
        if not last_window or last_window < window_start:
            system.tag.writeBlocking([count_tag, window_tag], [1, now])
            return True

        # Check limit
        if count >= max_requests:
            return False

        # Increment counter
        system.tag.writeBlocking([count_tag], [count + 1])
        return True

    else:
        # Use database
        result = system.db.runNamedQuery(
            "CheckRateLimit",
            {
                "client_id": client_id,
                "window_start": window_start,
                "max_requests": max_requests
            }
        )

        return result.getValueAt(0, 0)
'''
    }

    return rate_limit_config
```

## WebSocket Endpoints

```python
def configure_websocket():
    """Configure WebSocket endpoints for real-time data"""

    websocket_config = {
        "endpoint": "/ws/realtime",
        "handlers": {
            "onOpen": '''
def onOpen(session):
    """Handle WebSocket connection open"""
    session_id = session.getId()
    system.util.getLogger("WebSocket").info(f"Connection opened: {session_id}")

    # Store session
    sessions = system.util.getGlobals().get("websocket_sessions", {})
    sessions[session_id] = {
        "connected": system.date.now(),
        "subscriptions": []
    }
    system.util.getGlobals()["websocket_sessions"] = sessions
''',
            "onMessage": '''
def onMessage(session, message):
    """Handle incoming WebSocket message"""
    import json

    try:
        data = json.loads(message)
        action = data.get("action")

        if action == "subscribe":
            # Subscribe to tag changes
            tags = data.get("tags", [])
            subscribe_to_tags(session.getId(), tags)

        elif action == "unsubscribe":
            # Unsubscribe from tags
            tags = data.get("tags", [])
            unsubscribe_from_tags(session.getId(), tags)

        elif action == "ping":
            # Respond to ping
            session.send(json.dumps({"type": "pong"}))

    except Exception as e:
        session.send(json.dumps({"type": "error", "message": str(e)}))
''',
            "onClose": '''
def onClose(session):
    """Handle WebSocket connection close"""
    session_id = session.getId()
    system.util.getLogger("WebSocket").info(f"Connection closed: {session_id}")

    # Remove session
    sessions = system.util.getGlobals().get("websocket_sessions", {})
    if session_id in sessions:
        del sessions[session_id]
'''
        }
    }

    return websocket_config
```

## Documentation Links
- [WebDev Module](https://docs.inductiveautomation.com/docs/8.3/webdev-module)
- [REST API Design](https://docs.inductiveautomation.com/docs/8.3/webdev-module/rest-api)
- [WebSocket Support](https://docs.inductiveautomation.com/docs/8.3/webdev-module/websockets)