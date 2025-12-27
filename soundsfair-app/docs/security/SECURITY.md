# Security Policy

**soundsfair Security Guidelines and Vulnerability Reporting**

**Last Updated:** December 27, 2025

---

## 🔒 Security Measures

### Implemented Protections

#### 1. Authentication & Authorization
- **Admin Sessions:** AES-256-GCM encrypted HTTP-only cookies
- **CSRF Protection:** Token validation on all admin mutations
- **Session Timeout:** Automatic expiration after inactivity
- **Password Security:** Bcrypt hashing (cost factor 10)

#### 2. API Security
- **Rate Limiting:** IP-based (10 requests/10min) and email-based (5/hour)
- **Input Validation:** Zod schemas on all user inputs
- **SQL Injection Prevention:** Parameterized queries via Supabase
- **XSS Protection:** React automatic escaping
- **Webhook Verification:** HMAC-SHA256 signature validation

#### 3. Database Security
- **Row Level Security (RLS):** Enabled on all Supabase tables
- **Service Role Key:** Never exposed to client (server-side only)
- **Audit Logging:** All admin actions logged with IP and user agent
- **Encrypted Connections:** TLS/SSL for all database connections

#### 4. Headers & Transport
- **HTTPS Only:** Enforced in production (Vercel automatic)
- **Security Headers:**
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security` (production only)

#### 5. Email Security
- **Bounce/Complaint Handling:** Automatic tracking and unsubscribe
- **Email Preferences:** GDPR-compliant opt-out system
- **Template Sanitization:** All dynamic content sanitized

---

## 🚨 Reporting a Vulnerability

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via:

**Email:** security@soundsfair.com (preferred)
**Alternative:** Direct message to maintainers

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)
- Your contact information

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 7 days
- **Fix Timeline:** Depends on severity
  - **Critical:** Within 24-72 hours
  - **High:** Within 7 days
  - **Medium:** Within 30 days
  - **Low:** Within 90 days

### Disclosure Policy

- We follow **responsible disclosure**
- Please allow us time to fix before public disclosure
- We'll credit you in the changelog (if desired)

---

## 🛡️ Security Best Practices

### For Developers

#### Environment Variables
```bash
# ❌ NEVER commit to Git
.env.local
.env.production

# ✅ Always use strong secrets
ADMIN_SESSION_SECRET=<64+ random hex characters>
OPENNODE_WEBHOOK_SECRET=<strong random string>
```

#### API Keys
- **Never** log API keys or secrets
- **Never** expose service role key to client
- Use environment variables for all credentials
- Rotate keys periodically (every 90 days)

#### Input Validation
```typescript
// ✅ Always validate user input
const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive()
});

const result = schema.safeParse(userInput);
if (!result.success) {
  return { error: 'Invalid input' };
}
```

#### Database Queries
```typescript
// ✅ Use parameterized queries (Supabase does this)
const { data } = await supabase
  .from('questions')
  .select('*')
  .eq('user_email', email); // Safe - parameterized

// ❌ NEVER do string concatenation
// const query = `SELECT * FROM questions WHERE email = '${email}'`; // SQL injection!
```

### For Administrators

#### Access Control
- Use strong, unique passwords (32+ characters)
- Enable 2FA if available
- Don't share admin credentials
- Review audit logs regularly

#### Data Protection
- Never export user data without consent
- Delete old data according to retention policy
- Encrypt backups
- Use VPN for admin access

#### Incident Response
1. Document the incident
2. Contain the issue
3. Notify affected users
4. Implement fix
5. Review and improve

---

## 🔐 Security Checklist

### Pre-Production
- [ ] All environment variables configured in Vercel
- [ ] Service role key not exposed to client
- [ ] HTTPS enforced
- [ ] Webhook secrets configured
- [ ] Admin password is 32+ characters random
- [ ] CSRF protection enabled
- [ ] Rate limiting tested
- [ ] Security headers verified

### Post-Production
- [ ] Monitor audit logs weekly
- [ ] Review failed login attempts
- [ ] Check for unusual API activity
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Test backups monthly
- [ ] Review access permissions quarterly

---

## 🔄 Dependency Security

### Automated Checks
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual review required
npm audit fix --force
```

### Update Policy
- **Critical vulnerabilities:** Update immediately
- **High vulnerabilities:** Update within 7 days
- **Other:** Update in next release

### Monitoring
- GitHub Dependabot alerts enabled
- npm audit run in CI/CD
- Regular dependency updates

---

## 📋 Known Limitations

### Current Scope
- Admin authentication: Simple bcrypt (no 2FA yet)
- Rate limiting: In-memory (resets on deploy)
- File uploads: Not implemented (no file security needed)

### Future Improvements
- [ ] Implement 2FA for admin
- [ ] Add persistent rate limiting (Redis)
- [ ] Add IP whitelisting for admin
- [ ] Implement session recording
- [ ] Add intrusion detection

---

## 🆘 Security Incident Response

### If You Detect a Security Issue

1. **Immediate Actions:**
   - Document what you found
   - Do NOT exploit the vulnerability
   - Notify security team immediately

2. **Containment:**
   - Disable affected features if critical
   - Revoke compromised credentials
   - Block suspicious IPs

3. **Investigation:**
   - Review audit logs
   - Check affected data
   - Determine scope of impact

4. **Resolution:**
   - Deploy fix
   - Verify fix effectiveness
   - Monitor for recurrence

5. **Communication:**
   - Notify affected users
   - Update security documentation
   - Post-mortem analysis

---

## 📞 Contact

- **Security Team:** security@soundsfair.com
- **General Support:** support@soundsfair.com
- **Website:** https://soundsfair.vercel.app/

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Vercel Security](https://vercel.com/docs/security)

---

**Last Review:** December 27, 2025
**Next Review:** March 27, 2026
**Version:** 1.0
