# Quick Grocery Admin App

A modern admin dashboard for managing the Quick Grocery e-commerce platform. Built with React, TypeScript, and Vite.

## Features

- 🔐 **Authentication**: Secure login system with token-based authentication
- 📦 **Product Management**: Create, read, update, and delete grocery products
- 📂 **Category Management**: Organize products into categories
- 📋 **Order Management**: View and manage customer orders
- 📊 **Dashboard**: Real-time analytics and overview of key metrics
- 🎨 **Responsive UI**: Beautiful interface built with Tailwind CSS
- ✅ **Form Validation**: Client-side validation using React Hook Form and Zod

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd quick-grocery-admin-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5175`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   └── layout/         # Layout components (AdminShell, ProtectedRoute)
├── pages/              # Page components for different routes
│   ├── auth/           # Authentication pages
│   ├── categories/     # Category management pages
│   ├── orders/         # Order management pages
│   └── products/       # Product management pages
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management stores
├── interfaces/         # TypeScript interfaces and types
├── lib/                # Utility functions and helpers
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Directories

- **components/**: Reusable UI components and layout wrappers
- **pages/**: Full-page components corresponding to routes
- **hooks/**: Custom hooks for data fetching and logic (useAuth, useAdminProducts, etc.)
- **stores/**: Zustand stores for global state (authStore)
- **lib/**: API client configuration and query client setup
- **interfaces/**: TypeScript type definitions

## Available Pages

- **Dashboard**: Overview and key metrics
- **Products**: List and manage grocery products
- **Categories**: Organize and manage product categories
- **Orders**: View and process customer orders
- **Login**: Authentication page

## API Integration

The app uses an Axios-based API client configured in [lib/apiClient.ts](lib/apiClient.ts) with TanStack React Query for data fetching and caching.

## State Management

- **Authentication**: Managed via `authStore` (Zustand)
- **Server State**: Managed via TanStack React Query
- **Forms**: Managed via React Hook Form

## Environment Configuration

Create a `.env.local` file in the root directory with your API configuration:

```
VITE_API_BASE_URL=<your-api-url>
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.
