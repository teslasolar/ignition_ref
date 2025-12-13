# Alarm Notification Profiles

## Notification Parameters

```params
escalation_delay: 300
max_retries: 3
acknowledgment_required: true
consolidation_enabled: true
```

## Email Notification Profile

```python
def create_email_profile():
    '''Create email notification profile'''
    profile = {
        "name": "Critical_Alerts_Email",
        "type": "email",
        "enabled": True,
        "settings": {
            "smtp_server": "smtp.company.com",
            "port": 587,
            "use_tls": True,
            "username": "ignition@company.com",
            "from_address": "ignition@company.com",
            "subject_template": "ALERT: {displayPath} - {name}",
            "body_template": '''
                Alarm: {name}
                Priority: {priority}
                State: {eventState}
                Time: {eventTime}
                Value: {eventValue}
                Notes: {notes}
            '''
        }
    }
    return profile
```

## SMS Notification Profile

```python
def create_sms_profile():
    '''Create SMS notification profile'''
    profile = {
        "name": "Critical_Alerts_SMS",
        "type": "sms",
        "enabled": True,
        "settings": {
            "gateway": "Twilio",
            "account_sid": "AC...",
            "auth_token": "{encrypted}",
            "from_number": "+1234567890",
            "message_template": "{priority}: {displayPath} - {eventState}"
        }
    }
    return profile
```

## Voice Notification Profile

```python
def create_voice_profile():
    '''Create voice notification profile'''
    profile = {
        "name": "Emergency_Voice",
        "type": "voice",
        "enabled": True,
        "settings": {
            "gateway": "Twilio",
            "account_sid": "AC...",
            "auth_token": "{encrypted}",
            "from_number": "+1234567890",
            "message": "Critical alarm on {displayPath}. Press 1 to acknowledge."
        }
    }
    return profile
```

## Roster Management

```python
def create_alarm_roster():
    '''Create alarm notification roster'''
    roster = {
        "name": "Operations_Team",
        "users": [
            {
                "username": "operator1",
                "contact_type": "email",
                "contact": "operator1@company.com",
                "schedule": "always"
            },
            {
                "username": "supervisor",
                "contact_type": "sms",
                "contact": "+1234567890",
                "schedule": "business_hours"
            },
            {
                "username": "manager",
                "contact_type": "voice",
                "contact": "+0987654321",
                "schedule": "on_call"
            }
        ],
        "schedules": {
            "business_hours": "weekdays 8am-5pm",
            "on_call": "weekends and after hours",
            "always": "24/7"
        }
    }
    return roster
```

## Documentation Links
- [Alarm Notification](https://docs.inductiveautomation.com/docs/8.3/alarm-notification)
- [Notification Profiles](https://docs.inductiveautomation.com/docs/8.3/alarm-notification/notification-profiles)
