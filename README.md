# WorldPianos.org - Community Piano Directory

A modern web application for discovering and sharing public pianos worldwide. Built with React, TypeScript, DaisyUI, and Supabase.

## 🎹 About

WorldPianos.org is a global platform for piano enthusiasts to discover and share information about public pianos and related events worldwide. The mission is connecting piano enthusiasts globally, making it easy to find, share, and celebrate public pianos.

## ✨ Features

- **Interactive Piano Directory**: Browse and search public pianos worldwide
- **Event Calendar**: Discover piano-related events and meetups
- **User Accounts & Piano Passport**: Track your piano journey and earn achievements
- **Community Blog**: Stories and news from the world of public pianos
- **Mock Data Support**: Works offline with sample data when APIs aren't configured
- **Mobile-First Design**: Responsive design built with DaisyUI/Tailwind CSS
- **Role-Based Access**: Guest, User, Moderator, and Admin roles

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd worldpianos-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```bash
# Supabase Configuration (required for production)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional APIs (uses mock data if not provided)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
VITE_GEOCODING_API_KEY=your_geocoding_api_key
```

5. Start the development server:
```bash
npm run dev
```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Maps**: React Leaflet (with Google Maps fallback)
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Navbar, Footer)
│   ├── piano/          # Piano-related components
│   ├── event/          # Event-related components
│   ├── blog/           # Blog components
│   ├── admin/          # Admin dashboard components
│   └── map/            # Map components
├── pages/              # Page components
│   ├── home/           # Homepage
│   ├── pianos/         # Piano directory pages
│   ├── events/         # Event pages
│   ├── blog/           # Blog pages
│   ├── auth/           # Login/signup pages
│   ├── profile/        # User profile pages
│   └── admin/          # Admin pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── lib/                # Third-party integrations
└── data/               # Mock data and services
```

## 🔧 Development

### Mock Data Mode

The application includes comprehensive mock data that automatically activates when external APIs aren't configured. This allows you to:

- Develop and test features without setting up Supabase
- Demo the application with realistic sample data
- Work offline during development

Mock data includes:
- Sample pianos from around the world
- Upcoming events and meetups
- Blog posts and user profiles
- Authentication simulation

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

The app gracefully handles missing environment variables by falling back to mock data:

- **Supabase**: If not configured, uses mock authentication and data
- **Google Maps**: Falls back to OpenStreetMap via Leaflet
- **Analytics**: Skipped if not configured

## 🗄️ Database Schema

The Supabase database includes the following main tables:

- `profiles` - User profiles and roles
- `pianos` - Public piano listings
- `events` - Piano-related events
- `blog_posts` - Blog content
- `comments` - Comments on pianos, events, and posts
- `piano_images` - Images for piano listings
- `newsletter_subscriptions` - Email subscriptions

## 🎯 Roadmap

### High Priority
- [ ] Complete Supabase database setup
- [ ] Implement authentication system
- [ ] Build interactive world map
- [ ] Create piano detail pages

### Medium Priority
- [ ] User dashboard (Piano Passport)
- [ ] Content submission forms
- [ ] Admin moderation tools
- [ ] Event calendar system

### Low Priority
- [ ] Social media integration
- [ ] Newsletter system
- [ ] Multi-language support
- [ ] SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the global piano community
- Inspired by public piano installations worldwide
- Special thanks to organizations like Sing for Hope and Play Me, I'm Yours

---

Made with ♪ for piano lovers worldwide