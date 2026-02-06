# Solar Platform - Frontend

Modern, cinematic UI for the Solar Platform application built with React and Vite.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher)
- Bun or npm

## 🛠️ Installation

```bash
# Install dependencies
bun install
# or
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Running the Application

```bash
# Development mode
bun dev
# or
npm run dev

# Build for production
bun run build
# or
npm run build

# Preview production build
bun run preview
# or
npm run preview
```

## 🎨 Design System

The application features a cinematic, premium design with:

- **Color Palette**: Deep navy backgrounds with solar yellow accents
- **Typography**: Bold, uppercase tracking for headers
- **Effects**: Film grain, vignettes, glassmorphism
- **Animations**: Smooth transitions with Framer Motion

## 🗂️ Project Structure

```
src/
├── api/              # API client functions
├── auth/             # Authentication pages
├── components/       # Reusable components
│   └── ui/          # UI primitives
├── pages/           # Page components
│   ├── customer/    # Customer portal
│   ├── admin/       # Admin dashboard
│   └── superAdmin/  # Super admin panel
├── router/          # Route configuration
├── store/           # Zustand stores
├── schemas/         # Zod validation schemas
└── data/            # Mock data and constants
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:

- Access token for API requests
- Refresh token for token renewal
- Role-based access control (RBAC)

## 🎭 User Roles

- **Customer**: Solar installation customers
- **Plant Admin**: Manages grid plants
- **Region Admin**: Oversees regional operations
- **Super Admin**: Full system access

## 🧪 Testing

```bash
# Run tests
bun test
# or
npm test
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

```bash
# Build for production
bun run build

# The dist/ folder contains the production build
# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

## 📝 License

This project is proprietary and confidential.
