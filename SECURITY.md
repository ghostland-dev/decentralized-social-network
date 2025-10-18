# Security Policy

## Security Best Practices

### Private Key Management

⚠️ **CRITICAL**: Your Nostr private key (nsec) is the key to your identity. Protect it at all costs.

1. **Never Share Your Private Key**: Your private key should never be shared with anyone.
2. **Local Storage**: Keys are stored in browser localStorage. Clear your browser data if you suspect compromise.
3. **Use Browser Extensions**: Consider using Nostr browser extensions like Alby or nos2x for enhanced security.
4. **Backup Your Keys**: Save your private key in a secure location (password manager, encrypted file).

### Application Security

#### Current Implementation

- **Client-Side Key Storage**: Keys are stored in browser localStorage
- **No Server-Side Keys**: Keys never leave your device
- **HTTPS Required**: Always use HTTPS in production
- **Input Validation**: All user inputs are validated
- **XSS Protection**: React's built-in XSS protection is enabled

#### Recommendations for Production

1. **Content Security Policy (CSP)**
   - Add CSP headers to prevent XSS attacks
   - Restrict script sources to trusted domains

2. **Environment Variables**
   - Never commit `.env` files to version control
   - Use different keys for development and production

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Protect against DDoS attacks

4. **Logging and Monitoring**
   - Log security-relevant events
   - Monitor for suspicious activity
   - Set up alerts for failed authentication attempts

5. **Regular Updates**
   - Keep dependencies up to date
   - Regularly check for security vulnerabilities with `pnpm audit`

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email the security team directly at: [your-email@example.com]
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

## Security Checklist for Deployment

- [ ] HTTPS enabled and enforced
- [ ] Environment variables properly configured
- [ ] Content Security Policy headers set
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date
- [ ] Security audit completed (`pnpm audit`)
- [ ] Logging and monitoring configured
- [ ] Backup and recovery plan in place

## Known Limitations

### LocalStorage Security

Keys stored in localStorage are vulnerable to:
- XSS attacks (mitigated by React and CSP)
- Malicious browser extensions
- Physical access to the device

**Mitigation**: Use browser extensions like Alby or nos2x that implement NIP-07 for secure key management.

### Relay Trust

Nostr relays can:
- See your public key and posts
- Censor or filter your content
- Go offline

**Mitigation**: Connect to multiple relays and run your own relay if needed.

## Compliance

This application:
- Does not collect personal data
- Does not use tracking cookies
- Operates in a decentralized manner
- Gives users full control over their data

## Security Updates

Security updates will be released as soon as possible after discovery. Monitor the repository for updates.

---

Last Updated: 2025-10-18
