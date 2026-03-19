# AI Business Hub - Automated E-Commerce Management Platform

A comprehensive, production-ready platform for managing automated dropshipping and digital products businesses powered by advanced AI agents. Features a hierarchical agent system, intelligent approval workflows, and real-time monitoring capabilities.

## Features

### Core Functionality

**Automated Operations**
- AI-powered order fulfillment and supplier coordination
- Intelligent customer service with AI-generated responses
- Automated product listing with SEO optimization
- Intelligent marketing campaign generation and execution
- Real-time market research and competitive intelligence

**Hierarchical AI Agent System**
- Master Orchestrator coordinating all operations
- 6 specialized agents (Order Fulfillment, Customer Service, Product Listing, Marketing, Research, Tool Creation)
- Organized into 3 divisions (Operations, Commerce, Intelligence)
- Intelligent task distribution and load balancing
- Real-time health monitoring and performance tracking

**Smart Approval Workflows**
- Configurable approval thresholds
- Automatic approvals for standard operations
- Manual approvals for high-value/sensitive operations
- Audit trails for all decisions
- Escalation matrix for urgent items

**Comprehensive Dashboards**
- Real-time business metrics and KPIs
- Agent status and performance monitoring
- Order and fulfillment tracking
- Customer support ticket management
- Marketing campaign analytics
- Market research insights
- Approval queue management

**Enterprise Security**
- Row Level Security (RLS) on all data
- Secure authentication with Supabase Auth
- API key management
- Comprehensive audit logging
- Rate limiting and DDoS protection

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- SWR for data fetching and caching

**Backend**
- Next.js API Routes (serverless)
- Node.js
- TypeScript

**Database**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Realtime subscriptions

**Authentication**
- Supabase Auth
- Email/Password
- Session-based (JWT)

**Deployment**
- Vercel (recommended)
- Edge Functions support
- Automatic scaling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- (Optional) Vercel account for deployment

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-business-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Run database migrations**
```bash
# The database schema is created via Supabase SQL scripts
# Navigate to Supabase console and run scripts in order:
# 1. scripts/001_create_schema.sql
# 2. scripts/002_create_agents.sql
# ... and so on
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
ai-business-hub/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── error/
│   ├── dashboard/               # Main dashboard and features
│   │   ├── agents/             # AI agent management
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product catalog
│   │   ├── support/            # Support tickets
│   │   ├── marketing/          # Marketing campaigns
│   │   ├── research/           # Market research
│   │   ├── approvals/          # Approval workflows
│   │   └── settings/           # System settings
│   ├── api/                    # API routes
│   │   ├── agents/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── approvals/
│   │   ├── support/
│   │   ├── marketing/
│   │   └── research/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard components
│   │   ├── nav.tsx
│   │   └── ...
│   ├── orders/                 # Order management components
│   ├── products/               # Product components
│   ├── support/                # Support components
│   └── marketing/              # Marketing components
│
├── lib/
│   ├── supabase/              # Supabase client setup
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   ├── agents/                # Agent orchestration
│   │   └── orchestrator.ts
│   ├── orders/                # Order utilities
│   ├── products/              # Product utilities
│   ├── approvals/             # Approval utilities
│   ├── support/               # Support utilities
│   ├── marketing/             # Marketing utilities
│   └── research/              # Research utilities
│
├── middleware.ts              # Next.js middleware
├── scripts/                   # Database migration scripts
├── public/                    # Static assets
├── SYSTEM_ARCHITECTURE.md     # Architecture documentation
└── README.md                  # This file
```

## Key Features Explained

### AI Agent System

The platform uses a hierarchical agent architecture:

```
Master Orchestrator (Coordinator)
├── Operations Division
│   └── Order Fulfillment Agent
├── Commerce Division
│   ├── Customer Service Agent
│   ├── Product Listing Agent
│   └── Marketing Agent
└── Intelligence Division
    ├── Research Agent
    └── Tool Creation Agent
```

Each agent:
- Operates autonomously within its domain
- Reports to Master Orchestrator
- Respects approval thresholds
- Logs all actions for audit trail
- Provides performance metrics

### Approval Workflows

**Automatic (No approval needed):**
- Orders under $500
- Standard product listings
- Email campaigns under $100/day
- Customer service responses

**Manual (Requires approval):**
- Orders over $500
- International orders
- Refunds over $200
- Marketing campaigns over $100/day
- Pricing changes over 10%
- Bulk product listings over 20 items

### Dashboard Sections

**Dashboard** - Real-time metrics and agent status
**AI Agents** - Monitor and configure all agents
**Products** - Manage product catalog and inventory
**Orders** - Track orders and fulfillment
**Support** - Manage customer support tickets
**Marketing** - Create and monitor campaigns
**Research** - View market insights
**Approvals** - Review and approve pending actions
**Settings** - Configure system preferences

## API Documentation

All API routes require authentication. See `SYSTEM_ARCHITECTURE.md` for complete API reference.

Example - Fetching orders:
```javascript
const response = await fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { orders } = await response.json();
```

## Database Schema

The system uses a comprehensive PostgreSQL schema with 20+ tables covering:
- User profiles and permissions
- AI agents and logs
- Products and inventory
- Orders and fulfillment
- Support tickets
- Marketing campaigns
- Market research
- Approvals
- Audit trails

See `SYSTEM_ARCHITECTURE.md` for complete schema documentation.

## Configuration

### Approval Thresholds

Edit in Settings dashboard:
- Order approval threshold (default: $500)
- Refund approval threshold (default: $200)
- Marketing budget limit (default: $100/day)
- Bulk product limit (default: 20 items)

### Agent Configuration

Enable/disable agents and configure parameters in AI Agents section.

### Integrations

Currently supported:
- Supabase (database)
- Vercel (hosting)

Extensible for:
- Payment processors (Stripe)
- Shipping providers
- Marketing platforms
- Email services

## Security

The platform implements enterprise-grade security:

- **Row Level Security**: All data protected with RLS policies
- **Authentication**: Supabase Auth with JWT tokens
- **Encryption**: Credentials encrypted at rest
- **Audit Logging**: All actions logged with timestamps
- **Rate Limiting**: Protection against abuse
- **Input Validation**: All inputs validated and sanitized

See `SYSTEM_ARCHITECTURE.md` for security details.

## Performance

- **Frontend**: SSR, lazy loading, optimized images
- **Backend**: Async processing, batch operations
- **Database**: Indexed queries, connection pooling
- **Caching**: SWR with stale-while-revalidate

## Monitoring

Access monitoring tools in the dashboard:
- Agent health status
- Success/error rates
- Performance metrics
- System health indicators

## Troubleshooting

**Agents not processing tasks:**
1. Check agent status in AI Agents
2. Review agent logs
3. Verify approval thresholds

**Orders stuck in approval:**
1. Check Approvals queue
2. Ensure admin has reviewed
3. Check browser cache

**Database errors:**
1. Verify Supabase credentials
2. Check network connection
3. Review error logs

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Code Quality
```bash
npm run lint
```

## Deployment

### To Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with `vercel deploy`

### To Other Platforms

The application is a standard Next.js app and can be deployed to:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean

## Support

For issues or questions:
1. Check documentation in `SYSTEM_ARCHITECTURE.md`
2. Review agent logs in dashboard
3. Check browser console for errors
4. Review Supabase logs

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Roadmap

- [ ] WebSocket real-time updates
- [ ] Advanced analytics dashboard
- [ ] Custom report builder
- [ ] AI model fine-tuning interface
- [ ] Third-party app marketplace
- [ ] Multi-tenant support
- [ ] Mobile application
- [ ] Workflow automation builder

## Changelog

### Version 1.0.0 (Initial Release)
- Complete AI agent system
- Order fulfillment automation
- Customer support automation
- Product listing automation
- Marketing campaign automation
- Market research tools
- Comprehensive approval workflows
- Real-time monitoring dashboards
- Enterprise security features

---

**Platform Version:** 1.0.0
**Last Updated:** March 2024
**Created with:** Next.js 16, Supabase, Tailwind CSS

For more information, see `SYSTEM_ARCHITECTURE.md`
