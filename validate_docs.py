#!/usr/bin/env python
"""
Validate all documentation files before publishing to GitHub
"""
import os
import re
import sys
from pathlib import Path

class DocumentationValidator:
    def __init__(self, root_path="."):
        self.root = Path(root_path)
        self.errors = []
        self.warnings = []
        self.stats = {
            "total_files": 0,
            "valid_files": 0,
            "files_with_params": 0,
            "files_with_code": 0,
            "executable_blocks": 0
        }

    def validate_all(self):
        """Validate all markdown files in the repository"""
        print("=" * 60)
        print("Ignition Reference Documentation Validator")
        print("=" * 60)

        # Find all .md files
        md_files = list(self.root.glob("**/*.md"))
        self.stats["total_files"] = len(md_files)

        print(f"\nFound {len(md_files)} markdown files to validate\n")

        for md_file in md_files:
            if md_file.name in ["README_GITHUB.md", "setup_github.md"]:
                continue  # Skip meta files
            self.validate_file(md_file)

        self.print_report()
        return len(self.errors) == 0

    def validate_file(self, filepath):
        """Validate a single markdown file"""
        relative_path = filepath.relative_to(self.root)
        print(f"Validating: {relative_path}")

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check for params blocks
            params_blocks = re.findall(r'```params\n(.*?)\n```', content, re.DOTALL)
            if params_blocks:
                self.stats["files_with_params"] += 1

            # Extract Python code blocks
            code_blocks = re.findall(r'```python\n(.*?)\n```', content, re.DOTALL)

            if code_blocks:
                self.stats["files_with_code"] += 1

                # Test each code block
                for i, code in enumerate(code_blocks, 1):
                    if self.validate_python_code(code, filepath, i):
                        self.stats["executable_blocks"] += 1

            # Check for documentation links
            if "Documentation Links" not in content and "documentation" not in filepath.name.lower():
                self.warnings.append(f"{relative_path}: Missing documentation links section")

            self.stats["valid_files"] += 1
            print(f"  [OK] Valid\n")

        except Exception as e:
            self.errors.append(f"{relative_path}: {str(e)}")
            print(f"  [ERROR] Error: {e}\n")

    def validate_python_code(self, code, filepath, block_num):
        """Validate Python code syntax"""
        try:
            compile(code, str(filepath), 'exec')
            return True
        except SyntaxError as e:
            self.errors.append(
                f"{filepath.name} Block {block_num}: Syntax error at line {e.lineno}: {e.msg}"
            )
            return False

    def print_report(self):
        """Print validation report"""
        print("=" * 60)
        print("VALIDATION REPORT")
        print("=" * 60)

        # Statistics
        print("\n=== Statistics ===")
        print(f"  Total files:           {self.stats['total_files']}")
        print(f"  Valid files:           {self.stats['valid_files']}")
        print(f"  Files with params:     {self.stats['files_with_params']}")
        print(f"  Files with code:       {self.stats['files_with_code']}")
        print(f"  Executable blocks:     {self.stats['executable_blocks']}")

        # Coverage calculation
        if self.stats['total_files'] > 0:
            validity_rate = (self.stats['valid_files'] / self.stats['total_files']) * 100
            print(f"  Validity rate:         {validity_rate:.1f}%")

        # Errors
        if self.errors:
            print(f"\n[ERRORS] ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
        else:
            print("\n[SUCCESS] No errors found!")

        # Warnings
        if self.warnings:
            print(f"\n[WARNINGS] ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")

        # Summary
        print("\n" + "=" * 60)
        if self.errors:
            print("[FAILED] VALIDATION FAILED - Please fix errors before publishing")
        else:
            print("[PASSED] VALIDATION PASSED - Ready to publish to GitHub!")
        print("=" * 60)


def check_repository_structure():
    """Check if all expected directories exist"""
    expected_dirs = [
        "configuration",
        "database",
        "tags",
        "security",
        "perspective",
        "vision",
        "reporting",
        "sfc",
        "gateway",
        "devices",
        "scripting",
        "webdev",
        "ignition_cli"
    ]

    print("\n=== Checking Repository Structure ===")
    missing = []

    for dir_name in expected_dirs:
        if os.path.exists(dir_name):
            print(f"  [OK] {dir_name}/")
        else:
            print(f"  [ERROR] {dir_name}/ (missing)")
            missing.append(dir_name)

    if missing:
        print(f"\n[WARNING] {len(missing)} directories missing")
    else:
        print("\n[SUCCESS] All expected directories present")

    return len(missing) == 0


def check_critical_files():
    """Check for critical files"""
    critical_files = [
        "README.md",
        "LICENSE",
        "CONTRIBUTING.md",
        ".gitignore",
        "COMPONENTS_INDEX.md",
        "COVERAGE_ANALYSIS.md"
    ]

    print("\n=== Checking Critical Files ===")
    missing = []

    for filename in critical_files:
        if os.path.exists(filename):
            print(f"  [OK] {filename}")
        else:
            print(f"  [ERROR] {filename} (missing)")
            missing.append(filename)

    if missing:
        print(f"\n[ERROR] {len(missing)} critical files missing")
        return False
    else:
        print("\n[SUCCESS] All critical files present")
        return True


def main():
    """Main validation routine"""
    print("\n=== Starting Ignition Reference Documentation Validation ===\n")

    # Check repository structure
    structure_ok = check_repository_structure()

    # Check critical files
    files_ok = check_critical_files()

    # Validate documentation
    validator = DocumentationValidator()
    docs_ok = validator.validate_all()

    # Final summary
    print("\n" + "=" * 60)
    print("FINAL VALIDATION SUMMARY")
    print("=" * 60)

    all_ok = structure_ok and files_ok and docs_ok

    if all_ok:
        print("\n[SUCCESS] Your documentation is ready for GitHub!")
        print("\nNext steps:")
        print("1. All documentation validated successfully")
        print("2. Ready to commit and push changes")
        print("3. Repository is live on GitHub")
        return 0
    else:
        print("\n[WARNING] Some issues need attention before publishing")
        print("\nPlease fix the issues above and run validation again")
        return 1


if __name__ == "__main__":
    sys.exit(main())