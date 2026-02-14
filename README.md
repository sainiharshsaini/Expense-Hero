# 💰 Expense Hero — AI-Powered Personal Finance

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Expense Hero** is a modern, full-stack personal finance management application designed to give you total control over your wealth. Built with **Next.js 15**, **React 19**, and powered by **Google Gemini AI**, it simplifies expense tracking through intelligent automation.

---

## ✨ Key Features

- 📊 **Intelligent Dashboard**: Get a high-level view of your financial health with real-time stats and visual trends.
- � **AI Receipt Scanning**: Snap a photo or upload a receipt, and let **Google Gemini AI** automatically extract the merchant, amount, and category.
- � **Account Management**: Support for multiple bank accounts and credit cards with seamless transaction tracking.
- 📈 **Smart Budgeting**: Set monthly budgets and track progress with automated alerts and visual progress bars.
- 🔄 **Recurring Transactions**: Automate your monthly income and bills with built-in recurring transaction support.
- � **Advanced Analytics**: Detailed breakdown of spending habits by category and time, powered by **Recharts**.
- � **Secure Authentication**: Robust user management and social login (Google) powered by **Better-Auth**.
- 🛡️ **Advanced Protection**: Enterprise-grade rate limiting and bot protection using **Arcjet**.
- 📧 **Personalized Notifications**: Transaction confirmations and budget alerts delivered via **Inngest** and **Resend**.

---

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)

### Infrastructure & Services
- **Auth**: [Better-Auth](https://www.better-auth.com/)
- **AI**: [Google Gemini Pro Vision](https://ai.google.dev/)
- **Jobs**: [Inngest](https://www.inngest.com/) (Background job processing)
- **Security**: [Arcjet](https://arcjet.com/) (Bot detection, Rate limiting)
- **Emails**: [Resend](https://resend.com/) & [React Email](https://react.email/)

### UI/UX
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A PostgreSQL database instance
- API Keys for Google Gemini, Resend, and Better-Auth

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshxengr/expense-hero.git
   cd expense-hero
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://..."

   # AI
   GEMINI_API_KEY="..."

   # Better-Auth
   BETTER_AUTH_SECRET="..."
   BETTER_AUTH_URL="http://localhost:3000"

   # Google Auth (Optional)
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."

   # Resend & Inngest
   RESEND_API_KEY="..."
   INNGEST_EVENT_KEY="..."	# If applicable
   INNGEST_SIGNING_KEY="..."	# If applicable
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

```text
├── actions/         # Server Actions for data mutations
├── app/            # Next.js 15 App Router (Routes & Pages)
│   ├── (auth)/     # Authentication routes
│   └── (main)/     # Core application features (Dashboard, Account, etc.)
├── components/     # Reusable UI & Custom components
├── emails/         # React Email templates
├── hooks/          # Custom React hooks
├── lib/            # Configuration (Auth, Prisma, Inngest, Utils)
├── prisma/         # Database schema
└── public/         # Static assets
```

---

## 📜 Available Scripts

- `npm run dev` - Starts the development server with Turbopack.
- `npm run build` - Creates an optimized production build.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs the Biome linter and checks for issues.
- `npm run format` - Automatically formats the codebase using Biome.
- `npm run type-check` - Runs TypeScript type checking.
- `npm run email` - Starts the React Email preview server.

---

## 📸 UI Preview

![Dashboard Preview](/public/hero-section-img.svg)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.