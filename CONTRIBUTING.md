# Contributing to Ignition Reference Documentation

Thank you for considering contributing to this Ignition 8.3 reference documentation! This guide will help you understand how to contribute effectively.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Documentation Standards](#documentation-standards)
- [Contribution Process](#contribution-process)
- [Priority Areas](#priority-areas)
- [Testing Your Contributions](#testing-your-contributions)

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on technical accuracy
- Help maintain documentation quality

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/ignition-reference.git
   cd ignition-reference
   ```
3. Create a new branch for your contribution:
   ```bash
   git checkout -b feature/module-name
   ```

## 📝 Documentation Standards

All documentation must follow these standards:

### File Format

**All files must be executable markdown (.md)** with this structure:

```markdown
# Module Name

## Module Parameters

\```params
parameter1: value1
parameter2: value2
version: 8.3.0
\```

## Overview
Brief description of the module/component

## Check Status

\```python
#!/usr/bin/env python
import os
import json

def check_module_status():
    """Check if module is installed and configured"""
    # Your code here
    print("Status check implementation")
    return True

if __name__ == "__main__":
    check_module_status()
\```

## Documentation Links
- [Official Documentation](https://docs.inductiveautomation.com/docs/8.3/...)
```

### Code Requirements

1. **Executable Python**: All code blocks must be valid Python that can run independently
2. **Parameter Blocks**: Include ```params blocks for configuration values
3. **Import Statements**: Include all necessary imports within each code block
4. **Error Handling**: Include try/except blocks where appropriate
5. **Comments**: Add clear comments explaining functionality

### Style Guidelines

- **File Length**: Keep sections under 250 tokens for CLI compatibility
- **Naming**: Use descriptive, lowercase filenames with underscores
- **Organization**: Place files in appropriate module directories
- **Links**: Always include links to official Ignition documentation

## 🔄 Contribution Process

1. **Check Existing Issues**: Look for open issues or create a new one
2. **Discuss Major Changes**: Open an issue for discussion before starting large contributions
3. **Write Documentation**: Follow the standards above
4. **Test Your Code**: Ensure all Python code executes correctly
5. **Submit PR**: Create a pull request with a clear description

### Pull Request Template

```
## Description
Brief description of what this PR adds/changes

## Module/Component
- [ ] Module name: _____
- [ ] Coverage percentage: ____%

## Checklist
- [ ] All code is executable Python
- [ ] Includes parameter blocks
- [ ] Links to official documentation
- [ ] Tested on Ignition 8.3
- [ ] Follows file naming conventions
- [ ] Placed in correct directory

## Testing
How to test this documentation:
1. Run: `python module_name.md`
2. Expected output: _____
```

## 🎯 Priority Areas

### High Priority (Most Needed)

#### 1. Redundancy Configuration
Create `redundancy/redundancy_config.md` covering:
- Master/backup setup
- Failover configuration
- State synchronization
- Network requirements

#### 2. Siemens Drivers
Create `devices/siemens_drivers.md` covering:
- S7-300/400 configuration
- S7-1200/1500 setup
- TIA Portal integration
- Tag addressing

#### 3. MQTT Modules
Create directory `mqtt/` with:
- `mqtt_engine.md`
- `mqtt_transmission.md`
- `mqtt_distributor.md`
- Sparkplug B specification

### Medium Priority

#### 4. Enterprise Administration (EAM)
Create `eam/eam_module.md` covering:
- Controller/agent setup
- Task management
- Multi-gateway operations

#### 5. Advanced Historian
Enhance `database/historian_advanced.md` with:
- Partitioning strategies
- Performance optimization
- Data aggregation

### Low Priority

#### 6. Protocol Drivers
- `devices/dnp3_driver.md` - For utilities
- `devices/bacnet_driver.md` - For building automation
- `devices/iec61850_driver.md` - For substations

## 🧪 Testing Your Contributions

Before submitting, test your documentation:

### 1. Syntax Validation
```python
# Test markdown is valid Python
python your_new_file.md
```

### 2. Code Block Extraction
```python
import re

with open('your_new_file.md', 'r') as f:
    content = f.read()
    code_blocks = re.findall(r'```python\n(.*?)\n```', content, re.DOTALL)

for i, code in enumerate(code_blocks):
    print(f"Testing block {i+1}")
    try:
        exec(code)
        print("✓ Block executed successfully")
    except Exception as e:
        print(f"✗ Error: {e}")
```

### 3. Parameter Block Validation
Ensure all parameter blocks use this format:
```
\```params
key: value
key2: value2
\```
```

## 💡 Tips for Contributors

1. **Start Small**: Begin with a single component or feature
2. **Use Real Examples**: Include practical, real-world examples
3. **Reference Official Docs**: Always link to Inductive Automation's documentation
4. **Consider Industry Use**: Think about how different industries use the feature
5. **Include Troubleshooting**: Add common issues and solutions

## 🔍 Review Process

Pull requests will be reviewed for:

1. **Technical Accuracy**: Information must be correct for Ignition 8.3
2. **Code Quality**: Python code must be executable and follow best practices
3. **Documentation Quality**: Clear, well-organized, and helpful
4. **Standard Compliance**: Follows the project's documentation standards

## 📚 Resources

- [Ignition 8.3 Documentation](https://docs.inductiveautomation.com/docs/8.3)
- [Ignition SDK Documentation](https://github.com/inductiveautomation/ignition-sdk-examples)
- [Python Best Practices](https://docs.python-guide.org/)
- [Markdown Guide](https://www.markdownguide.org/)

## 🆘 Getting Help

- Open an issue for questions
- Check existing issues and discussions
- Refer to official Ignition forums for platform-specific questions

## 🎉 Recognition

All contributors will be recognized in the project README. Significant contributions may be highlighted in release notes.

Thank you for helping make this resource valuable for the Ignition community!