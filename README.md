# ExpenseHero

A modern personal finance management application built with Next.js 16, featuring comprehensive expense tracking, budget management, and AI-powered financial insights.

## Overview

ExpenseHero is a full-stack financial dashboard that helps users track income and expenses, manage multiple accounts, set budgets, and gain insights into spending patterns. The application includes authentication, receipt scanning with AI, recurring transactions, scheduled reports, and budget alerts.

## Features

- **Authentication**: Email/password and Google OAuth integration using Better Auth
- **Account Management**: Multiple current and savings accounts with default account selection
- **Transaction Tracking**: Comprehensive income and expense recording with categorization
- **AI Receipt Scanning**: Google Gemini integration for automatic receipt data extraction
- **Budget Management**: Monthly budget setting with real-time progress tracking
- **Recurring Transactions**: Automated recurring transactions processed by Inngest
- **Financial Analytics**: Interactive charts for monthly trends and category spending analysis
- **Scheduled Reports**: Monthly financial reports and budget alert emails via Resend
- **Responsive Design**: Optimized for both desktop and mobile experiences

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router and Turbopack
- **React 19**: Latest React with enhanced performance
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Recharts**: Data visualization and charting
- **React Hook Form**: Form management with Zod validation
- **Sonner**: Toast notifications

### Backend
- **PostgreSQL**: Relational database
- **Prisma ORM**: Type-safe database access
- **Better Auth**: Authentication solution
- **Inngest**: Background job processing and scheduling
- **Google Gemini**: AI for receipt scanning and financial insights
- **Resend**: Email delivery service
- **React Email**: Email template management

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- PostgreSQL database
- Google OAuth credentials (for social sign-in)
- Gemini API key (for receipt scanning)
- Resend API key (for email features)
- Inngest account (for background jobs)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expensehero"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GEMINI_API_KEY="your-gemini-api-key"
RESEND_API_KEY="your-resend-api-key"
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

3. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google OAuth Setup

For local development, configure your Google OAuth web client with:

- **Authorized JavaScript origin**: `http://localhost:3000`
- **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`

For production, update these URLs to match your deployed domain.

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run type-check   # Run TypeScript compiler
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm run auth:migrate # Apply Better Auth migrations
```

## Project Structure

```
actions/              # Server actions for data operations
├── account.ts       # Account management
├── budget.ts        # Budget operations
├── dashboard.ts     # Dashboard data fetching
├── transaction.ts   # Transaction CRUD and receipt scanning
└── send-email.ts    # Email operations

app/                  # Next.js app directory
├── (auth)/          # Authentication pages
├── (main)/          # Main application pages
├── api/             # API routes
└── layout.tsx       # Root layout

components/           # React components
├── auth/            # Authentication components
├── custom/          # Custom application components
└── ui/              # Reusable UI components

lib/                  # Utility libraries
├── auth/            # Authentication configuration
├── inngest/         # Background job functions
├── prisma.ts        # Database client
└── utils.ts         # Helper functions

data/                # Static data
├── categories.ts    # Transaction categories

emails/              # Email templates
prisma/             # Database schema and migrations
public/             # Static assets
```

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts and authentication
- **FinancialAccount**: Bank accounts (current/savings)
- **Transaction**: Income and expense records
- **Budget**: Monthly budget limits
- **Session**: User sessions for authentication

## Key Features Implementation

### AI Receipt Scanning

Receipt scanning uses Google Gemini to extract transaction data from images:

- Automatic amount detection
- Date extraction
- Merchant identification
- Category suggestion
- Description generation

### Recurring Transactions

Inngest processes recurring transactions based on configured intervals:

- Daily, weekly, monthly, yearly options
- Automatic transaction creation
- Balance updates
- Next occurrence scheduling

### Budget Alerts

Automatic budget monitoring sends alerts when spending reaches 80% of the monthly limit.

### Monthly Reports

Scheduled financial reports provide:

- Monthly income and expense summary
- Category breakdown
- AI-generated financial insights
- Savings rate analysis

## Production Deployment

### Environment Variables

For production, update the following:

```env
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Deployment Steps

1. Build the application:

```bash
npm run build
```

2. Set up production PostgreSQL database
3. Configure environment variables
4. Run database migrations:

```bash
npx prisma db push
```

5. Deploy to your preferred platform (Vercel, Railway, etc.)

### Additional Production Considerations

- Configure Google OAuth for production domain
- Use verified Resend sending domain
- Set up Inngest production environment
- Configure proper error monitoring
- Enable logging and analytics

## Contributing

This is a personal portfolio project. For suggestions or issues, please feel free to reach out.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [Better Auth](https://www.better-auth.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)