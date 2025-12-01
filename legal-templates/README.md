# Legal Templates - Customization Guide

## 📂 Files Created

✅ **privacy-policy.md** - GDPR/CCPA/LGPD compliant privacy policy
✅ **terms-and-conditions.md** - Terms of use for educational Bitcoin site
✅ **disclaimer.md** - Critical disclaimers for Bitcoin/crypto education

---

## ⚠️ IMPORTANT: THESE ARE TEMPLATES

These documents are **TEMPLATES** and must be customized before use.

**You MUST:**
1. Replace all placeholders (marked with [BRACKETS])
2. Review and adjust for your specific situation
3. Have a lawyer review before publishing (recommended)

---

## 🔧 CUSTOMIZATION CHECKLIST

Go through EACH file and replace these placeholders:

### 🔴 CRITICAL (Must replace in ALL 3 files):

- [ ] `[YOUR PROJECT NAME]` → Your actual project name (e.g., "SATS21", "soundsfair", etc.)
- [ ] `[YOUR-DOMAIN.com]` → Your actual domain (e.g., "sats21.com")
- [ ] `[your-email@domain.com]` → Your actual contact email
- [ ] `[Date you launch website]` → Actual launch date (e.g., "August 15, 2025")
- [ ] `[YOUR JURISDICTION]` → Your country/state (e.g., "Brazil", "State of California, USA")

### 🟡 IMPORTANT (Situation-dependent):

- [ ] `[Your Legal Entity Name]` → Your business name or personal name
- [ ] `[Your Address]` → Business address (if applicable for GDPR)
- [ ] `[Lightning Payment Provider]` → OpenNode, Strike, or whatever you use
- [ ] `[TBD - Resend/SendGrid]` → Email service you'll use

### 🟢 OPTIONAL (Adjust based on your plans):

- [ ] **Payment terms** → Adjust if you change pricing or refund policy
- [ ] **Response time** → Currently says "7 business days" for Q&A - adjust if different
- [ ] **Data retention** → Currently says 2-7 years depending on type - adjust if needed
- [ ] **Age restriction** → Currently says 18+ (or 16+ in EU) - verify for your jurisdiction

---

## 📝 FILE-SPECIFIC CUSTOMIZATION NOTES

### privacy-policy.md

**Section: Third-Party Services**
- Update when you finalize:
  - Lightning payment provider (OpenNode/Strike/other)
  - Email service (Resend/SendGrid/other)
  - Any other third-party tools you add

**Section: International Data Transfers**
- If you're NOT in EU/USA, adjust accordingly

**Section: For Specific Regions**
- If you're NOT targeting EU/Brazil/California, you can simplify this
- If you ARE in those regions, verify compliance carefully

---

### terms-and-conditions.md

**Section: Lightning Network Payments (Section 4)**
- This is critical for paid features
- Update payment terms when you finalize pricing
- Adjust response time commitments

**Section: Governing Law (Section 11)**
- Replace `[YOUR JURISDICTION]` with actual jurisdiction
- Consider consulting local lawyer for this section

**Section: Dispute Resolution**
- Arbitration clauses vary by jurisdiction
- May need lawyer review for enforceability

---

### disclaimer.md

**This is your MOST IMPORTANT legal protection document.**

**Review carefully:**
- All risk warnings are accurate for your content
- Calculator disclaimers match your actual calculator
- Lightning payment warnings are clear
- Affiliate disclosure section (if you use affiliate links)

**Update when you add features:**
- New tools (add disclaimers)
- New payment types (update payment section)
- New partnerships (update affiliate section)

---

## 🚀 IMPLEMENTATION STEPS

### STEP 1: Customize NOW (15-20 minutes)

✅ **ALREADY DONE - Placeholders replaced:**

- ✅ Project name: **SoundsFair**
- ✅ Domain: **soundsfair.com**
- ✅ Email: **soundsfair@tuta.io**
- ⚠️ Still needed: Jurisdiction (Brazil or other?)
- ⚠️ Still needed: Dates (when you launch)

**Still to replace:**
```bash
# Replace jurisdiction
Find: [YOUR JURISDICTION]
Replace: Brazil  # (or your country)

# Replace launch date
Find: [Date you launch website]
Replace: August 2025  # (your actual launch date)
```

### STEP 2: Review & Adjust (10-15 minutes)

Read through each file and:
- Remove sections that don't apply
- Add sections for features not covered
- Adjust language to match your tone

### STEP 3: Implement in Website (Month 3-5)

When building your Next.js site:

Create pages:
- `/pages/privacy-policy.tsx` → render privacy-policy.md
- `/pages/terms.tsx` → render terms-and-conditions.md
- `/pages/disclaimer.tsx` → render disclaimer.md

Add footer links:
```tsx
<footer>
  <Link href="/privacy-policy">Privacy Policy</Link>
  <Link href="/terms">Terms & Conditions</Link>
  <Link href="/disclaimer">Disclaimer</Link>
</footer>
```

### STEP 4: Add Prominent Disclaimers

**On DCA Calculator page:**
```tsx
<div className="disclaimer-box">
  ⚠️ This calculator is for educational purposes only.
  Past performance does not guarantee future results.
  <Link href="/disclaimer">Read full disclaimer</Link>
</div>
```

**On Ask (paid Q&A) page:**
```tsx
<div className="disclaimer-box">
  ⚠️ Responses are educational opinions, NOT financial advice.
  Lightning payments are final and non-refundable.
  <Link href="/disclaimer">Read full disclaimer</Link>
</div>
```

**In footer (site-wide):**
```tsx
<div className="footer-disclaimer">
  Educational content only. Not financial advice.
  <Link href="/disclaimer">Full Disclaimer</Link>
</div>
```

---

## 📅 WHEN TO UPDATE TEMPLATES

### Month 1-6 (NOW - Development Phase):
✅ Use these free templates as-is (customized)
✅ No public users yet = low risk

### Month 7-8 (Pre-Launch):
🔴 **UPGRADE TO TERMLY ($200/year)**
- Before beta testing with real users
- Before activating Lightning payments
- Before collecting emails

**Why upgrade?**
- Auto-updates when laws change
- Better compliance coverage
- Cookie consent management
- More professional

### Ongoing:
- Update when you add new features
- Update when laws change (or let Termly handle it)
- Review annually

---

## ⚖️ LEGAL REVIEW CHECKLIST

**Before PUBLIC launch, have a lawyer review:**

- [ ] Privacy Policy (GDPR/CCPA/LGPD compliance)
- [ ] Terms & Conditions (enforceability in your jurisdiction)
- [ ] Disclaimer (adequate protection for your content)
- [ ] Lightning payment terms (regulatory compliance)
- [ ] Business structure (LLC, sole proprietorship, etc.)

**Cost:** $500-1,500 for lawyer review

**When:** Month 7-8 (2 months before launch)

**Budget:** Already allocated in REALISTIC_EXECUTION_PLAN.md

---

## 🔗 RELATED DOCUMENTS

- **REALISTIC_EXECUTION_PLAN.md** → See Month 7-8 for Termly upgrade
- **ROADMAP_VISUAL.md** → Legal setup timeline
- **SKILLS_MASTER_PLAN.md** → Section 5 (Legal/Compliance skills)

---

## ❓ FAQ

### Q: Can I use these templates as-is without a lawyer?

**A:** For development phase (Month 1-6), yes - with proper customization.
For public launch with real users and payments, lawyer review is STRONGLY recommended.

### Q: Are these templates enforceable in [my country]?

**A:** These templates are based on US/EU best practices. They cover basics for most jurisdictions, but you should verify with local legal counsel.

### Q: What if I can't afford $200 for Termly or $500-1,500 for lawyer?

**A:**
- Keep using free templates (higher risk, but manageable for small projects)
- Don't activate paid features (Lightning) until you can afford legal review
- Apply for Bitcoin grants (HRF, OpenSats) - mention legal compliance in proposal

### Q: Do I need ALL three documents?

**A:** YES. Each serves a different purpose:
- **Privacy Policy** → Required by law (GDPR/CCPA/LGPD)
- **Terms & Conditions** → Protects you from misuse, sets rules
- **Disclaimer** → CRITICAL for Bitcoin education (liability protection)

### Q: What about Cookie Consent banner?

**A:**
- **Month 1-6:** Use simple banner (provided in REALISTIC_EXECUTION_PLAN.md)
- **Month 7+:** Termly includes professional cookie consent manager

---

## ✅ COMPLETION CHECKLIST

Mark these when done:

- [ ] Replaced ALL placeholders in privacy-policy.md
- [ ] Replaced ALL placeholders in terms-and-conditions.md
- [ ] Replaced ALL placeholders in disclaimer.md
- [ ] Read through all documents (understood content)
- [ ] Saved customized versions
- [ ] Added to project roadmap: "Upgrade to Termly in Month 7" ($200)
- [ ] Added to project roadmap: "Lawyer review in Month 7-8" ($500-1.5K)

---

## 🚀 NEXT STEPS

1. ✅ Customize these templates NOW (15-20 min) - use find & replace
2. ✅ Save in this folder
3. ✅ Move on to next Week 1 task (Next.js course or Fiverr job)
4. 📅 Revisit in Month 7 to upgrade to Termly
5. 📅 Get lawyer review in Month 7-8 before launch

---

**Status:** ✅ LEGAL TEMPLATES READY FOR DEVELOPMENT PHASE

**Cost so far:** $0 ✅ (saving $200 for later)

**Risk level:** 🟢 LOW (no public users yet)

---

*Last updated: November 25, 2024*
