# ReferralFlow 🚀

A competitive Base44 referral program application with weekly leaderboards and winner rewards.

## Features

- 📊 **Real-time Referral Tracking** - Track all referrals and credits in real-time
- 🏆 **Weekly Leaderboards** - Competitive rankings updated weekly
- 🎯 **Winner Rewards** - Top referrers win credits and badges each week
- 🔗 **Shareable Referral Links** - Easy referral link generation and sharing
- 📈 **Analytics Dashboard** - View referral stats and performance metrics
- 💰 **Credit System** - Earn credits for successful referrals
- 🎁 **Bonus Rewards** - Extra credits when referred users upgrade to paid plans

## Referral Program Mechanics

### Base Credit System
- **Friend Signs Up**: 30 credits
- **Friend Publishes App**: 30 credits  
- **Friend Upgrades to Paid**: 100 credits
- **Weekly Bonus**: Top 3 referrers earn bonus credits

### Weekly Competition
- **Winner**: Most referrals in the week
- **Runner-up**: 2nd most referrals
- **Third Place**: 3rd most referrals
- **Bonus Credits**: 500, 300, 100 respectively
- **Reset**: Leaderboard resets every Monday

### Restrictions
- Credits expire after 40 days if unused
- Credits cannot be reset if there's a signup error
- Referral links are unique per user
- Unlimited referral attempts (no cap)

## Project Structure

```
ReferralFlow/
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema
│   └── FEATURES.md         # Feature specifications
├── src/
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── services/          # Business logic
│   ├── api/               # API endpoints
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── tests/                  # Test files
├── config/                 # Configuration files
├── .env.example            # Environment variables template
├── package.json            # Dependencies
└── CONTRIBUTING.md         # Contribution guidelines
```

## Setup

### Prerequisites
- Node.js 16+
- Base44 account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rebeccaaliciadreaver-ui/ReferralFlow.git
cd ReferralFlow

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```
REACT_APP_BASE44_API_KEY=your_api_key
REACT_APP_BASE44_APP_ID=your_app_id
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Key Features Implementation

### 1. Referral Link Generation
- Unique link per user
- QR code generation
- Easy copy-to-clipboard
- Tracking parameter: `?ref=USER_ID`

### 2. Weekly Leaderboard
- Automated weekly reset (Monday 00:00 UTC)
- Real-time score updates
- Historical tracking of past weeks
- Winner announcement notifications

### 3. Analytics Dashboard
- Total referrals count
- Active referral links
- Credits earned (by week)
- Conversion metrics
- Historical performance

### 4. Notifications
- Referral success notifications
- Weekly winner announcements
- Credit expiration reminders
- Upgrade opportunity alerts

## API Endpoints

### Referrals
- `GET /api/referrals` - Get user's referrals
- `POST /api/referrals/create-link` - Generate referral link
- `GET /api/referrals/track/:ref` - Track referral click
- `POST /api/referrals/validate` - Validate referral completion

### Leaderboard
- `GET /api/leaderboard/weekly` - Get current week's leaderboard
- `GET /api/leaderboard/history` - Get past weeks' leaderboards
- `GET /api/leaderboard/user/:id` - Get user's ranking

### Credits
- `GET /api/credits/balance` - Get user's credit balance
- `GET /api/credits/history` - Get credit transaction history
- `POST /api/credits/claim-reward` - Claim weekly bonus

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/stats` - Get referral statistics

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests for new functionality
4. Submit a pull request
5. Code review and merge

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.js

# Run with coverage
npm test -- --coverage
```

## Deployment

- **Staging**: Push to `develop` branch
- **Production**: Merge to `main` branch
- Automated CI/CD via GitHub Actions

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/rebeccaaliciadreaver-ui/ReferralFlow/issues).

---

**Made with ❤️ by ReferralFlow Team**
