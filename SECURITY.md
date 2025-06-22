# Security Policy

## Supported Versions

This example project demonstrates usage of the `aws-testing-framework` package. Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in this project, please follow these steps:

### 1. **Do Not** Open a Public Issue

Security vulnerabilities should be reported privately to avoid potential exploitation.

### 2. Report the Vulnerability

Please report security vulnerabilities by:

- **Opening a private security advisory** on GitHub (preferred)
- **Emailing** the maintainers directly if you cannot use GitHub

### 3. What to Include

When reporting a vulnerability, please include:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up questions

### 4. Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 1 week
- **Resolution**: As quickly as possible, typically within 30 days

### 5. Disclosure Policy

- Vulnerabilities will be disclosed publicly after a fix is available
- Credit will be given to reporters who follow responsible disclosure
- A CVE will be requested for significant vulnerabilities

## Security Best Practices

When using this example project:

### AWS Credentials
- **Never commit** AWS credentials to version control
- **Use IAM roles** when possible instead of access keys
- **Rotate credentials** regularly
- **Use least privilege** principle for IAM permissions

### Environment Variables
- **Store sensitive data** in environment variables
- **Use .env files** for local development (not committed)
- **Validate environment** variables at startup

### Dependencies
- **Keep dependencies updated** regularly
- **Use `npm audit`** to check for known vulnerabilities
- **Review dependency changes** before updating

### Testing
- **Use test AWS accounts** when possible
- **Clean up test resources** after testing
- **Avoid testing against production** environments

## Security Contacts

For security-related questions or reports:

- **GitHub Security Advisories**: [Create a private security advisory](https://github.com/sophiegle/aws-testing-framework-test/security/advisories)
- **Issues**: [Open a security issue](https://github.com/sophiegle/aws-testing-framework-test/issues)

## Acknowledgments

We appreciate security researchers and community members who help keep this project secure through responsible disclosure. 