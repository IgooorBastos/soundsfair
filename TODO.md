# TODO List - Soundsfair Project

**Last Updated**: December 2, 2025

---

## ✅ COMPLETED (Recent)

### December 2, 2025
- [x] CSV Export feature for DCA Calculator
- [x] Bitcoin-only DCA Calculator simplification
- [x] Remove mock data for S&P500, Gold, MSCI World
- [x] Switch to CoinCap API as primary (unlimited history)
- [x] Add toast notification for CSV export
- [x] Improve fade-in animation
- [x] Update CHANGELOG.md
- [x] Create PROJECT_STATUS.md documentation

---

## 🔥 CRITICAL PRIORITY (Do First)

### Testing & Quality Assurance
- [ ] **Test CSV export in browser**
  - [ ] Run `npm run dev`
  - [ ] Navigate to DCA calculator
  - [ ] Test export with sample data
  - [ ] Verify CSV opens in Excel
  - [ ] Verify CSV opens in Google Sheets
  - [ ] Check toast notification appears
  - [ ] Test with various date ranges
  - [ ] Test with different frequencies

### Version Control
- [ ] **Create git commit for CSV export feature**
  - [ ] Stage all modified files
  - [ ] Write comprehensive commit message
  - [ ] Include Co-Authored-By for Claude
  - [ ] Push to remote repository

### Deployment
- [ ] **Deploy to staging environment**
  - [ ] Verify build succeeds
  - [ ] Test all routes work
  - [ ] Smoke test DCA calculator
  - [ ] Test CSV export on live URL

---

## 🚀 HIGH PRIORITY (Next 1-2 Weeks)

### Feature Development
- [ ] **Implement Share Results feature**
  - [ ] Design URL parameter structure
  - [ ] Implement URL generation function
  - [ ] Add URL parsing on page load
  - [ ] Create "Copy URL" button
  - [ ] Add clipboard API integration
  - [ ] Add toast notification for copy success
  - [ ] Test shared URLs work correctly
  - [ ] Handle invalid URL parameters gracefully
  - **Estimated Time**: 2-3 hours

- [ ] **Create reusable Toast component**
  - [ ] Design Toast component API
  - [ ] Implement different types (success, error, warning, info)
  - [ ] Add queue system for multiple toasts
  - [ ] Add dismiss button
  - [ ] Add ARIA labels for accessibility
  - [ ] Migrate existing toast to use new component
  - **Estimated Time**: 1-2 hours

### Code Quality
- [ ] **Add TypeScript strict mode checks**
  - [ ] Review and fix any type errors
  - [ ] Add proper type definitions
  - [ ] Remove any 'any' types

- [ ] **Write unit tests for CSV export**
  - [ ] Test escapeCSVValue function
  - [ ] Test formatCSVDate function
  - [ ] Test generateCSVHeader function
  - [ ] Test generateSummarySection function
  - [ ] Test generateTransactionsSection function
  - [ ] Setup Jest/Vitest if needed

---

## 📋 MEDIUM PRIORITY (Next 1-3 Months)

### Content Development
- [ ] **Create Levels 1-4 content**
  - [ ] Level 1: Introduction to Money
  - [ ] Level 2: History of Currency
  - [ ] Level 3: Fiat System Problems
  - [ ] Level 4: Bitcoin Basics
  - [ ] Add associated quiz questions
  - [ ] Add new glossary terms
  - [ ] Add beginner FAQ entries
  - **Estimated Time**: 3-4 weeks

### Backend Infrastructure
- [ ] **Setup database (PostgreSQL + Prisma)**
  - [ ] Design database schema
  - [ ] Setup Prisma ORM
  - [ ] Create migration files
  - [ ] Setup local development database
  - [ ] Setup production database
  - **Estimated Time**: 1 week

- [ ] **Implement user authentication**
  - [ ] Install NextAuth.js
  - [ ] Configure authentication providers
  - [ ] Create user database models
  - [ ] Implement login/signup pages
  - [ ] Add protected routes
  - [ ] Add session management
  - **Estimated Time**: 1-2 weeks

- [ ] **Implement progress tracking**
  - [ ] Create progress database schema
  - [ ] Track lesson completion
  - [ ] Track quiz scores
  - [ ] Track reading time
  - [ ] Create progress dashboard
  - **Estimated Time**: 1 week

### Feature Enhancements
- [ ] **Add more DCA frequency options**
  - [ ] Add "daily" option
  - [ ] Add "quarterly" option
  - [ ] Add "yearly" option
  - [ ] Test calculations with new frequencies

- [ ] **DCA Calculator enhancements**
  - [ ] Add chart image export
  - [ ] Add JSON export format
  - [ ] Add PDF export format (optional)
  - [ ] Add data validation before export
  - [ ] Add CSV format options (delimiter choice)

### Legal & Compliance
- [ ] **Create legal pages**
  - [ ] Terms of Service
  - [ ] Privacy Policy
  - [ ] Cookie Policy
  - [ ] Disclaimer
  - [ ] Review by legal professional
  - **Estimated Time**: 1-2 days

### Analytics & Monitoring
- [ ] **Setup analytics**
  - [ ] Install Plausible Analytics (privacy-friendly)
  - [ ] Configure tracking events
  - [ ] Setup custom goals
  - [ ] Create dashboard
  - **Estimated Time**: 1 day

- [ ] **Setup error monitoring**
  - [ ] Install Sentry
  - [ ] Configure error tracking
  - [ ] Setup alerts
  - [ ] Test error reporting
  - **Estimated Time**: 1 day

---

## 🔮 LOW PRIORITY (Nice to Have)

### Performance Optimization
- [ ] **Run Lighthouse audit**
  - [ ] Measure performance score
  - [ ] Measure accessibility score
  - [ ] Measure best practices score
  - [ ] Measure SEO score
  - [ ] Fix identified issues

- [ ] **Optimize bundle size**
  - [ ] Analyze bundle with webpack-bundle-analyzer
  - [ ] Remove unused dependencies
  - [ ] Implement code splitting
  - [ ] Lazy load components
  - [ ] Optimize images

- [ ] **Improve loading times**
  - [ ] Implement static generation where possible
  - [ ] Add loading states
  - [ ] Implement skeleton screens
  - [ ] Optimize API calls
  - [ ] Add request caching

### Accessibility
- [ ] **Full WCAG audit**
  - [ ] Run automated accessibility tests
  - [ ] Manual keyboard navigation testing
  - [ ] Screen reader testing
  - [ ] Color contrast verification
  - [ ] Fix identified issues

### SEO Optimization
- [ ] **Meta tags optimization**
  - [ ] Review all page titles
  - [ ] Review all meta descriptions
  - [ ] Add Open Graph images
  - [ ] Add Twitter Card meta tags
  - [ ] Create robots.txt
  - [ ] Generate sitemap.xml

### UI/UX Improvements
- [ ] **Add dark/light mode toggle**
  - [ ] Design toggle component
  - [ ] Implement theme switching
  - [ ] Save user preference
  - [ ] Apply theme across all pages

- [ ] **Improve mobile experience**
  - [ ] Test on multiple devices
  - [ ] Optimize touch targets
  - [ ] Improve mobile navigation
  - [ ] Test forms on mobile

### Additional Features
- [ ] **Bitcoin mining calculator**
  - [ ] Design calculator UI
  - [ ] Implement profitability calculations
  - [ ] Add current mining difficulty
  - [ ] Add electricity cost inputs

- [ ] **Bitcoin halving countdown**
  - [ ] Calculate next halving date
  - [ ] Create countdown component
  - [ ] Add historical halving data
  - [ ] Show reward reduction impact

- [ ] **Live Bitcoin price ticker**
  - [ ] Integrate real-time price API
  - [ ] Create ticker component
  - [ ] Add to header or footer
  - [ ] Show 24h change

- [ ] **Portfolio tracker**
  - [ ] Design portfolio interface
  - [ ] Implement holdings tracking
  - [ ] Calculate current value
  - [ ] Show profit/loss
  - [ ] Add multiple wallets support

---

## 🎓 LEARNING & RESEARCH

### Technical Research
- [ ] Research Lightning Network integration options
  - [ ] BTCPay Server vs OpenNode vs Strike
  - [ ] Compare features and pricing
  - [ ] Test integration complexity

- [ ] Research payment processing
  - [ ] Invoice generation
  - [ ] Payment verification
  - [ ] Refund handling
  - [ ] Tax reporting

### Content Research
- [ ] Research beginner Bitcoin content
  - [ ] Review other educational sites
  - [ ] Identify content gaps
  - [ ] Plan content strategy

---

## 🐛 BUGS & ISSUES

### Current Issues
- No known bugs at this time

### To Investigate
- [ ] Check CSV export with very large datasets (10+ years daily)
- [ ] Test CSV export with special characters in different locales
- [ ] Verify toast notification works on all browsers
- [ ] Test DCA calculator with extreme date ranges

---

## 📝 DOCUMENTATION TASKS

### Technical Documentation
- [ ] **Create API documentation**
  - [ ] Document /api/prices endpoint
  - [ ] Document /api/dca/calculate endpoint
  - [ ] Add request/response examples
  - [ ] Document error codes

- [ ] **Create component documentation**
  - [ ] Document all component props
  - [ ] Add usage examples
  - [ ] Document component patterns
  - [ ] Add storybook (optional)

- [ ] **Create deployment guide**
  - [ ] Document deployment process
  - [ ] Add environment setup steps
  - [ ] Document CI/CD pipeline
  - [ ] Add troubleshooting section

### User Documentation
- [ ] **Create user guide**
  - [ ] How to use DCA calculator
  - [ ] How to export CSV
  - [ ] How to share results
  - [ ] FAQ section

- [ ] **Create video tutorials**
  - [ ] DCA calculator walkthrough
  - [ ] Reading lessons tutorial
  - [ ] Quiz system tutorial

---

## 🔄 RECURRING TASKS

### Weekly
- [ ] Review and update TODO.md
- [ ] Review and update PROJECT_STATUS.md
- [ ] Check for npm package updates
- [ ] Review git commits
- [ ] Test all critical features

### Monthly
- [ ] Full regression testing
- [ ] Performance audit
- [ ] Security audit
- [ ] Review analytics data
- [ ] Update roadmap
- [ ] Review and prioritize backlog

### Quarterly
- [ ] Major version planning
- [ ] Feature roadmap review
- [ ] Technology stack review
- [ ] Competitor analysis
- [ ] User feedback review

---

## 💭 IDEAS BACKLOG (Unprocessed)

### Feature Ideas
- Export DCA chart as image
- Email digest of lessons
- Social media sharing cards
- Referral program
- Achievement badges
- Community forum
- Live chat support
- Webinar integration
- Podcast player
- News aggregator
- Price alerts system
- Custom notifications

### Content Ideas
- Bitcoin glossary quiz
- Historical events timeline
- Famous Bitcoin quotes
- Bitcoin myths debunking
- Security best practices guide
- Tax reporting guide
- Node setup tutorial
- Lightning Network guide
- Privacy guide
- Backup strategies guide

### Technical Ideas
- Progressive Web App (PWA)
- Desktop app (Electron)
- Browser extension
- Mobile app (React Native)
- Offline mode
- Print-friendly format
- API for third-party integration
- Webhook system
- Custom theme builder

---

## 📊 METRICS TO TRACK

### Development Metrics
- [ ] Setup code coverage tracking
- [ ] Setup build time monitoring
- [ ] Setup bundle size tracking
- [ ] Track test execution time

### User Metrics (Post-Launch)
- [ ] Daily Active Users (DAU)
- [ ] Lesson completion rate
- [ ] Average session duration
- [ ] DCA calculator usage
- [ ] CSV export count
- [ ] Share results usage
- [ ] Bounce rate
- [ ] Page load time

---

## 🎯 MILESTONES

### Milestone 1: MVP Complete ✅
- [x] Core website functional
- [x] 5 lessons published (Levels 5-9)
- [x] DCA calculator working
- [x] CSV export implemented
- [x] Basic documentation

### Milestone 2: Public Beta (Target: Q1 2025)
- [ ] All 9 lessons complete
- [ ] User authentication
- [ ] Progress tracking
- [ ] Legal pages
- [ ] Analytics setup
- [ ] Performance optimized

### Milestone 3: Monetization (Target: Q2 2025)
- [ ] Lightning payments
- [ ] Paid Q&A feature
- [ ] Premium content
- [ ] Certificate generation
- [ ] Payment processing

### Milestone 4: Community (Target: Q3 2025)
- [ ] Forum/discussion board
- [ ] User profiles
- [ ] Social features
- [ ] Content contributions
- [ ] Moderation system

### Milestone 5: Scale (Target: Q4 2025)
- [ ] Mobile apps
- [ ] Portuguese translation
- [ ] Video library
- [ ] Advanced features
- [ ] API access

---

**Notes**:
- This TODO list is a living document
- Update after completing tasks
- Re-prioritize regularly based on business needs
- Move completed items to "COMPLETED" section with date
- Archive old completed items to CHANGELOG.md

**Legend**:
- 🔥 = Critical/Urgent
- 🚀 = High Priority
- 📋 = Medium Priority
- 🔮 = Low Priority/Nice to Have
- ✅ = Completed
- [ ] = Not Started
- [x] = In Progress
