# KisanMitra App 🌾

A comprehensive agricultural management platform built with Next.js, designed to empower farmers with modern tools and resources for better farming practices.

## 🚀 Features

### Core Modules
- **AI Chat Assistant** - Intelligent chatbot for farming queries and guidance
- **Photo Analysis** - AI-powered crop and pest detection using image analysis
- **FarmerScope** - Real-time farm advisories from kisanmitra.net
- **PestScope** - Latest pest alerts and management strategies
- **Guides** - Comprehensive farming guides and best practices
- **Community** - Connect with other farmers and share knowledge
- **Calendar** - Crop planning and seasonal activity management
- **Suppliers** - Find and connect with agricultural suppliers
- **Tracking** - Monitor crop growth and farm activities
- **Dashboard** - Overview of all farm operations and analytics
- **Plan** - Strategic crop planning and resource management
- **Grow** - Growth tracking and optimization tools
- **Sell** - Marketplace features for selling produce

### Technical Features
- 🌍 Multi-language support (i18n)
- 📱 Responsive mobile-first design
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time data fetching with Next.js API routes
- 🌐 Web scraping integration for live agricultural advisories
- ⚡ Optimized performance with React 19

## 📦 Dependencies

### Production Dependencies
```json
{
  "cheerio": "^1.1.2",           // Web scraping for farm advisories
  "lucide-react": "^0.548.0",    // Modern icon library
  "next": "^16.0.2",             // React framework
  "prettier": "^3.6.2",          // Code formatting
  "react": "19.2.0",             // UI library
  "react-dom": "19.2.0"          // React DOM renderer
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",          // Node.js type definitions
  "@types/react": "^19",         // React type definitions
  "@types/react-dom": "^19",     // React DOM type definitions
  "autoprefixer": "^10.4.21",    // PostCSS plugin for CSS prefixing
  "eslint": "^9",                // JavaScript linter
  "eslint-config-next": "^16.0.2", // Next.js ESLint configuration
  "postcss": "^8.5.6",           // CSS transformer
  "tailwindcss": "^3.4.14",      // Utility-first CSS framework
  "tailwindcss-animate": "^1.0.7", // Animation utilities for Tailwind
  "typescript": "^5"             // TypeScript compiler
}
```

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Agriworks/kisanmitra_app.git
cd kisanmitra_app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🚀 Getting Started

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 📁 Project Structure

```
kisanmitra_app/
├── app/
│   ├── api/                    # API routes
│   │   ├── farmer-scope/       # Farm advisory scraping API
│   │   └── pest-scope/         # Pest alert scraping API
│   ├── components/             # React components
│   │   ├── CalendarView.tsx
│   │   ├── ChartBot.tsx
│   │   ├── Community.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FarmerScope.tsx
│   │   ├── FeaturesComing.tsx
│   │   ├── Grow.tsx
│   │   ├── Guides.tsx
│   │   ├── LanguageSelection.tsx
│   │   ├── PestScope.tsx
│   │   ├── PhotoAnalysis.tsx
│   │   ├── Plan.tsx
│   │   ├── Sell.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── Suppliers.tsx
│   │   └── Tracking.tsx
│   ├── globals.css             # Global styles
│   ├── i18n.tsx                # Internationalization setup
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── providers.tsx           # Context providers
├── public/                     # Static assets
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Styling

This project uses:
- **Tailwind CSS** - Utility-first CSS framework
- **tailwindcss-animate** - Pre-built animations
- **Lucide React** - Beautiful, consistent icons
- **PostCSS** - CSS transformations

## 🌐 API Routes

### FarmerScope API (`/api/farmer-scope`)
- Scrapes live farm advisories from kisanmitra.net
- Returns categorized farming advice and updates
- Provides latest agricultural news and recommendations

### PestScope API (`/api/pest-scope`)
- Fetches real-time pest alerts
- Returns pest management strategies
- Provides preventive measures and treatments

## 🔧 Configuration

### TypeScript
The project is fully typed with TypeScript for better developer experience and code quality.

### ESLint
Configured with Next.js recommended rules for consistent code style.

### Prettier
Automatic code formatting on save for clean and consistent code.

## 🌍 Internationalization

The app supports multiple languages through the i18n system in `app/i18n.tsx`. Language selection is available through the LanguageSelection component.

## 📱 Responsive Design

Built mobile-first with responsive breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Agriworks/kisanmitra_app)

### Build for Production

```bash
npm run build
npm run start
```

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs) - JavaScript with syntax for types
- [Cheerio](https://cheerio.js.org/) - Fast, flexible web scraping

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 👥 Team

Developed by Agriworks

---

**KisanMitra** - Empowering farmers through technology 🌾
