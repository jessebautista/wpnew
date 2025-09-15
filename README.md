# 🎹 WorldPianos

**Connecting piano enthusiasts worldwide, making it easy to find, share, and celebrate public pianos.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jessebautista/wpnew)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 🌍 About

WorldPianos is a modern web application that serves as a comprehensive global directory of public pianos and piano-related events. Built for the international piano community, it enables users to discover playable pianos worldwide, share their musical experiences, and connect with fellow piano enthusiasts.

### ✨ Key Features

- 🗺️ **Interactive Global Map** - Discover public pianos worldwide with clustering and location search
- 🎹 **Comprehensive Piano Directory** - Detailed listings with photos, reviews, and community ratings
- 📅 **Event Calendar** - Find and create piano-related events, meetups, and performances
- 👤 **Piano Passport** - Personal dashboard to track your piano journey and achievements
- 📝 **Community Blog** - Articles, stories, and updates from the world of public pianos
- 🛡️ **Content Moderation** - Quality control with user-friendly submission and verification workflow
- 📱 **Mobile-First Design** - Fully responsive, optimized for travelers and mobile users
- 🌐 **Social Integration** - Share discoveries and connect with the global piano community

## 🚀 Live Demo

Visit the live application: **[worldpianos.org](https://worldpianos.org)**

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe, modern development
- **Vite** for fast development and optimized production builds
- **DaisyUI + Tailwind CSS** for consistent, responsive UI components
- **React Leaflet** for interactive mapping with OpenStreetMap
- **React Router** for client-side routing and navigation
- **React Hook Form + Zod** for form validation and management

### Backend
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with Row Level Security (RLS) for data protection
- **Supabase Storage** for image uploads and file management
- **Supabase Auth** for user authentication and session management

### Additional Services
- **Google Maps API** (optional) for enhanced geocoding
- **Resend** for transactional emails and newsletter functionality
- **Google Analytics** for usage tracking and insights

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Google Maps API key for enhanced mapping features

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/jessebautista/wpnew.git
   cd wpnew/worldpianos-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_MOCK_DATA=false
   
   # Optional services
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   VITE_RESEND_API_KEY=your_resend_api_key
   ```

4. **Database setup**
   
   Run the database schema and sample data in your Supabase project:
   ```sql
   -- See documentation for complete schema setup
   -- Available in /docs/database-schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Mock Data Mode
For development or demonstration purposes, you can run the application with mock data:

```env
VITE_USE_MOCK_DATA=true
```

This enables the application to run without a backend, perfect for:
- Local development
- Demonstrations
- Testing UI components
- Offline development

### Optional Integrations

#### Google Maps (Enhanced Mapping)
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

#### Google Analytics (Usage Tracking)
```env
VITE_GA_MEASUREMENT_ID=your_measurement_id
```

#### Resend (Email Service)
```env
VITE_RESEND_API_KEY=your_resend_api_key
```

## 📱 Mobile Support

WorldPianos is built with a mobile-first approach:

- **Responsive Design**: Optimized for all device sizes
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Offline Capability**: Core features work with limited connectivity
- **Performance Optimized**: Fast loading on mobile networks
- **PWA Ready**: Installable as a Progressive Web App

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared UI components
│   ├── events/         # Event-related components
│   ├── map/            # Map and mapping components
│   └── piano/          # Piano-specific components
├── pages/              # Route-level page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── blog/           # Blog and content pages
│   ├── events/         # Event management pages
│   ├── pianos/         # Piano directory pages
│   └── static/         # Static informational pages
├── services/           # API and business logic
├── types/              # TypeScript type definitions
├── utils/              # Helper functions and utilities
└── lib/                # Third-party integrations
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add some amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns and styling
- Ensure mobile responsiveness
- Add proper error handling
- Include JSDoc comments for complex functions
- Test your changes on both mock and real data modes

### Code Style
- We use ESLint and Prettier for code formatting
- Run `npm run lint` before committing
- Follow existing naming conventions
- Use semantic commit messages

## 📄 API Documentation

### Public Endpoints
- `GET /api/pianos` - List public pianos
- `GET /api/events` - List public events  
- `GET /api/blog` - List blog posts

### Authenticated Endpoints
- `POST /api/pianos` - Create piano listing
- `POST /api/events` - Create event
- `PUT /api/users/profile` - Update user profile

### Admin Endpoints
- `GET /api/admin/moderation` - Get moderation queue
- `POST /api/admin/verify` - Verify content
- `GET /api/admin/users` - Manage users

*Full API documentation available in the [API Reference](docs/api.md)*

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### Docker
```bash
docker build -t worldpianos .
docker run -p 3000:3000 worldpianos
```

## 🔒 Security

- All user input is validated and sanitized
- Row Level Security (RLS) policies protect data access
- HTTPS encryption for all data transmission
- Secure file upload handling with type restrictions
- Regular dependency updates for security patches

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for Google's performance standards
- **Image Optimization**: Automatic compression and lazy loading
- **Code Splitting**: Efficient bundle loading
- **Caching**: Strategic caching for optimal performance

## 🌐 Browser Support

- Chrome/Chromium 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sing for Hope** - Piano installation data and partnership
- **OpenStreetMap** - Open-source mapping data
- **Supabase** - Backend infrastructure and database
- **React Community** - Excellent ecosystem and libraries
- **Piano Community** - Users who make this platform valuable

## 📞 Support

- **Documentation**: [docs.worldpianos.org](https://docs.worldpianos.org)
- **Issues**: [GitHub Issues](https://github.com/jessebautista/wpnew/issues)
- **Email**: support@worldpianos.org
- **Community**: Join our [Discord server](https://discord.gg/worldpianos)

## 🗺️ Roadmap

### 2024 Q4
- [ ] Mobile app development (React Native)
- [ ] Advanced search with AI-powered recommendations
- [ ] Multi-language support (Spanish, French, German)
- [ ] Enhanced achievement system

### 2025 Q1
- [ ] API for third-party integrations
- [ ] Piano organization dashboard
- [ ] Advanced analytics and insights
- [ ] Community forums and messaging

---

**Built with ❤️ by the WorldPianos team and community contributors**

*Connecting piano enthusiasts worldwide, one key at a time* 🎹✨