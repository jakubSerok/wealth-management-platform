# Wealth Management Platform

A comprehensive personal finance management application built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### **Financial Overview**
- **Net Worth Tracking** - Real-time calculation of total assets across all accounts
- **Account Management** - Support for multiple account types (checking, savings, investments, crypto, etc.)
- **Transaction History** - Complete record of all financial transactions
- **Category Management** - Hierarchical categorization with icons and colors

### **Investment Tracking**
- **Portfolio Management** - Track stocks, crypto, and other investments
- **Asset Performance** - Monitor price changes and returns
- **Dividend Tracking** - Automatic dividend income calculation

### **Budget & Goals**
- **Budget Planning** - Set and track spending limits by category
- **Financial Goals** - Define and monitor progress toward financial objectives
- **Subscription Management** - Track recurring expenses

### **Data Visualization**
- **Interactive Charts** - Net worth growth, spending patterns, investment performance
- **Category Breakdowns** - Visual representation of spending by category
- **Monthly Reports** - Comprehensive financial summaries

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

## 📁 Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/        # Main application pages
│   └── api/               # API routes
├── components/             # Reusable UI components
│   └── ui/               # Base UI components (shadcn/ui)
├── features/              # Feature-based modules
│   ├── accounts/           # Account management
│   ├── auth/              # Authentication logic
│   ├── categories/         # Category management
│   ├── profile/            # User profile & statistics
│   └── transactions/      # Transaction management
├── lib/                   # Utility functions
│   ├── db.ts             # Database configuration
│   └── net-worth-calculations.ts # Financial calculations
├── prisma/                # Database schema & migrations
│   ├── schema.prisma      # Database model definitions
│   └── seed.ts            # Database seeding
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### **Installation**

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd wealth-management-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database with default categories
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the application.

## 📊 Database Schema

### **Core Models**
- **User** - User accounts and authentication
- **Account** - Financial accounts (checking, savings, investments, etc.)
- **Transaction** - All financial transactions
- **Category** - Hierarchical transaction categorization
- **Asset** - Investment holdings (stocks, crypto, etc.)
- **Budget** - Spending limits and tracking
- **FinancialGoal** - Long-term financial objectives

### **Key Features**
- **Multi-currency Support** - Automatic currency conversion
- **Historical Data** - Complete transaction history
- **Real-time Updates** - Live balance calculations
- **Hierarchical Categories** - Main categories with subcategories

## 🎯 Available Categories

### **Income Categories**
- Salary 💰, Freelance 💻, Investment Returns 📈, Gifts 🎁, Other Income 💵

### **Expense Categories**
- **Bills** 📄 (Rent, Electricity, Water, Gas, Internet, Phone, TV/Cable)
- **Food** 🍔 (Groceries, Restaurants, Coffee, Fast Food, Alcohol)
- **Transport** 🚗 (Public Transport, Fuel, Car Maintenance, Parking, Taxi/Uber)
- **Shopping** 🛍️ (Clothing, Electronics, Home & Garden, Books, Sports)
- **Entertainment** 🎮 (Movies, Games, Music, Events, Hobbies)
- **Health** 🏥, **Education** 📚, **Travel** ✈️, **Home** 🏠
- **Insurance** 🛡️, **Subscriptions** 📱, **Gym** 💪

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed     # Seed database with categories
```

### **Database Commands**
```bash
npx prisma studio     # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run database migrations
npx prisma db pull   # Pull schema from database
```

## 🔒 Security Features

- **Secure Authentication** - NextAuth.js with session management
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM parameterized queries
- **CSRF Protection** - Built-in Next.js security
- **Environment Variables** - Sensitive data in .env files

## 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Modern UI** - Clean, intuitive interface
- **Accessibility** - WCAG compliant components
- **Dark Mode Support** - Theme switching capability

## 🚀 Deployment

### **Environment Variables**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wealth_management"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### **Build & Deploy**
```bash
# Build application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Review existing [issues](../../issues)

---

**Built with ❤️ for better financial management**
