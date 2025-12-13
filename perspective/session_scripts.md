# Perspective Session Scripts

## Session Parameters

```params
project: default
timeout: 900
max_sessions: 100
session_props: custom,auth,locale,device
```

## Session Event Scripts

### Session Startup

```python
def onStartup(session):
    """Execute when a new session starts"""
    # Get session information
    session_id = session.id
    username = session.auth.user.userName if session.auth.user else "Anonymous"
    client_ip = session.props.address

    # Initialize custom session properties
    session.custom.loginTime = system.date.now()
    session.custom.pageViews = 0
    session.custom.userRole = "Operator"

    # Log session start
    logger = system.util.getLogger("Session")
    logger.info(f"Session started: {session_id} - User: {username} - IP: {client_ip}")

    # Set user preferences from database
    if username != "Anonymous":
        prefs = system.db.runNamedQuery("GetUserPreferences", {"username": username})
        if prefs.rowCount > 0:
            session.custom.theme = prefs.getValueAt(0, "theme")
            session.custom.language = prefs.getValueAt(0, "language")
            session.custom.dashboard = prefs.getValueAt(0, "default_dashboard")

    # Initialize device-specific settings
    if session.props.device.type == "mobile":
        session.custom.viewMode = "compact"
    else:
        session.custom.viewMode = "full"

    # Navigate to default page
    default_page = session.custom.dashboard if hasattr(session.custom, 'dashboard') else "/home"
    system.perspective.navigate(page=default_page)
```

### Session Shutdown

```python
def onShutdown(session):
    """Execute when session ends"""
    # Calculate session duration
    start_time = session.custom.loginTime
    end_time = system.date.now()
    duration = system.date.secondsBetween(start_time, end_time)

    username = session.auth.user.userName if session.auth.user else "Anonymous"

    # Log session metrics to database
    system.db.runNamedQuery(
        "LogSessionMetrics",
        {
            "session_id": session.id,
            "username": username,
            "start_time": start_time,
            "end_time": end_time,
            "duration": duration,
            "page_views": session.custom.pageViews
        }
    )

    # Clean up session resources
    logger = system.util.getLogger("Session")
    logger.info(f"Session ended: {session.id} - Duration: {duration}s")
```

### Page Startup

```python
def onPageStartup(page):
    """Execute when a page loads"""
    page_url = page.props.primaryView

    # Increment page view counter
    page.session.custom.pageViews += 1

    # Track page navigation
    system.db.runNamedQuery(
        "LogPageView",
        {
            "session_id": page.session.id,
            "page_url": page_url,
            "timestamp": system.date.now(),
            "user": page.session.auth.user.userName if page.session.auth.user else "Anonymous"
        }
    )

    # Apply page-specific settings
    if "settings" in page_url:
        page.session.custom.editMode = True
    else:
        page.session.custom.editMode = False

    # Check permissions for the page
    user_roles = page.session.auth.roles if page.session.auth else []
    required_roles = getPageRequiredRoles(page_url)

    if not any(role in user_roles for role in required_roles):
        system.perspective.navigate(page="/unauthorized")

def getPageRequiredRoles(page_url):
    """Get required roles for a page"""
    role_map = {
        "/admin": ["Administrator"],
        "/settings": ["Administrator", "Engineer"],
        "/reports": ["Administrator", "Engineer", "Supervisor"],
        "/control": ["Operator", "Engineer", "Administrator"]
    }

    for path, roles in role_map.items():
        if path in page_url:
            return roles

    return []  # No specific roles required
```

## Custom Session Properties

```python
def initialize_custom_properties():
    """Initialize custom session properties structure"""

    custom_props = {
        # User preferences
        "preferences": {
            "theme": "light",  # light/dark
            "language": "en",
            "dateFormat": "MM/dd/yyyy",
            "timeFormat": "HH:mm:ss",
            "timezone": "America/New_York"
        },

        # Application state
        "state": {
            "selectedMachine": "",
            "selectedArea": "",
            "activeAlarms": [],
            "filterSettings": {},
            "viewMode": "grid"  # grid/list/card
        },

        # User permissions
        "permissions": {
            "canEdit": False,
            "canDelete": False,
            "canApprove": False,
            "canExport": True,
            "maxExportRows": 10000
        },

        # Session metrics
        "metrics": {
            "loginTime": None,
            "lastActivity": None,
            "pageViews": 0,
            "apiCalls": 0,
            "dataUsage": 0
        },

        # Temporary data storage
        "temp": {
            "clipboard": None,
            "undoStack": [],
            "redoStack": [],
            "draftData": {}
        }
    }

    return custom_props
```

## Message Handlers

```python
def configure_message_handlers():
    """Session message handler configurations"""

    handlers = {
        "refreshData": {
            "handler": "onRefreshData",
            "scope": "session",
            "script": '''
def onRefreshData(session, payload):
    """Refresh data based on payload"""
    data_type = payload.get("type", "all")

    if data_type == "alarms":
        # Refresh alarm data
        alarms = system.alarm.queryStatus(state=["ActiveUnacked"])
        session.custom.state.activeAlarms = [
            {
                "name": alarm.name,
                "priority": alarm.priority,
                "timestamp": alarm.activeTime
            }
            for alarm in alarms
        ]

    elif data_type == "tags":
        # Refresh tag values
        tag_paths = payload.get("paths", [])
        if tag_paths:
            values = system.tag.readBlocking(tag_paths)
            return [{"path": p, "value": v.value} for p, v in zip(tag_paths, values)]

    return {"status": "refreshed", "type": data_type}
'''
        },

        "updatePreference": {
            "handler": "onUpdatePreference",
            "scope": "session",
            "script": '''
def onUpdatePreference(session, payload):
    """Update user preference"""
    pref_name = payload.get("name")
    pref_value = payload.get("value")

    if pref_name and pref_value is not None:
        # Update session
        session.custom.preferences[pref_name] = pref_value

        # Save to database
        if session.auth.user:
            system.db.runNamedQuery(
                "UpdateUserPreference",
                {
                    "username": session.auth.user.userName,
                    "preference": pref_name,
                    "value": str(pref_value)
                }
            )

        return {"status": "updated", "preference": pref_name}

    return {"status": "error", "message": "Invalid preference"}
'''
        }
    }

    return handlers
```

## Authentication Events

```python
def configure_auth_events():
    """Authentication event handlers"""

    def onLogin(session):
        """Handle successful login"""
        user = session.auth.user

        # Load user profile
        profile = system.db.runNamedQuery(
            "GetUserProfile",
            {"username": user.userName}
        )

        if profile.rowCount > 0:
            session.custom.userProfile = {
                "firstName": profile.getValueAt(0, "first_name"),
                "lastName": profile.getValueAt(0, "last_name"),
                "email": profile.getValueAt(0, "email"),
                "department": profile.getValueAt(0, "department")
            }

        # Set permissions based on roles
        roles = session.auth.roles

        if "Administrator" in roles:
            session.custom.permissions.canEdit = True
            session.custom.permissions.canDelete = True
            session.custom.permissions.canApprove = True
        elif "Engineer" in roles:
            session.custom.permissions.canEdit = True
            session.custom.permissions.canApprove = True

        # Log login event
        system.util.audit(
            action="LOGIN",
            actionTarget=user.userName,
            actionValue="SUCCESS"
        )

        # Navigate to dashboard
        system.perspective.navigate(page="/dashboard")

    def onLogout(session):
        """Handle logout"""
        username = session.auth.user.userName if session.auth.user else "Unknown"

        # Save session state if needed
        if session.custom.temp.draftData:
            system.db.runNamedQuery(
                "SaveDraftData",
                {
                    "username": username,
                    "data": system.util.jsonEncode(session.custom.temp.draftData)
                }
            )

        # Clear sensitive session data
        session.custom.temp = {}
        session.custom.permissions = {}

        # Log logout event
        system.util.audit(
            action="LOGOUT",
            actionTarget=username,
            actionValue="SUCCESS"
        )

        # Navigate to login page
        system.perspective.logout()

    return {
        "onLogin": onLogin,
        "onLogout": onLogout
    }
```

## Idle Detection

```python
def configure_idle_detection():
    """Configure session idle timeout handling"""

    idle_config = {
        "enabled": True,
        "timeout": 900,  # 15 minutes in seconds
        "warning": 60,   # Warning 60 seconds before timeout
        "script": '''
def onIdle(session):
    """Handle idle timeout"""
    # Show warning popup
    system.perspective.openPopup(
        id="idle-warning",
        view="Popups/IdleWarning",
        params={
            "message": "Your session will expire in 60 seconds",
            "countdown": 60
        },
        modal=True
    )

def onIdleReset(session):
    """Reset idle timer"""
    # Close warning if open
    system.perspective.closePopup("idle-warning")

    # Update last activity
    session.custom.metrics.lastActivity = system.date.now()

def onIdleTimeout(session):
    """Handle timeout expiration"""
    # Log timeout
    system.util.getLogger("Session").info(
        f"Session timeout: {session.id}"
    )

    # Force logout
    system.perspective.logout()
'''
    }

    return idle_config
```

## Documentation Links
- [Session Events](https://docs.inductiveautomation.com/docs/8.3/perspective/session-events)
- [Custom Properties](https://docs.inductiveautomation.com/docs/8.3/perspective/session-properties)
- [Message Handlers](https://docs.inductiveautomation.com/docs/8.3/perspective/message-handlers)