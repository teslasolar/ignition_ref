#!/usr/bin/env python
"""Run the extraction script from markdown"""
import re
import os

# Read the markdown file
with open('extract_components.md', 'r') as f:
    content = f.read()

# Extract Python code blocks
code_blocks = re.findall(r'```python\n(.*?)\n```', content, re.DOTALL)

# Execute the main code block (the class and main execution)
if code_blocks:
    # Join all code blocks as they build on each other
    full_code = '\n'.join(code_blocks)
    exec(full_code)
else:
    print("No Python code blocks found in extract_components.md")