# Product Management Application

A full-stack web application built with Next.js for managing products, categories, and shop functionality. This project provides both an admin dashboard for product management and a protected shop interface.

## Features

- 🛍️ **Product Management**
  - Create, edit, and delete products
  - Image upload functionality
  - Product categorization
  - Product listing with pagination

- 🔐 **Admin Dashboard**
  - Secure admin login
  - Product management interface
  - Category management
  - Dashboard analytics

- 🏪 **Shop Frontend**
  - Browse products
  - Product detail pages
  - Category filtering
  - Responsive design

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **State Management**: Redux with Redux Toolkit
- **Type Safety**: TypeScript
- **Form Handling**: Form validations
- **Image Upload**: Built-in image upload functionality

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RJRatul/product-management-app.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin-login/       # Admin authentication
│   ├── dashboard/         # Admin dashboard features
│   └── shop/             # Public shop pages
├── components/            # Reusable React components
├── lib/                   # Utilities and API functions
└── providers/            # Application providers
```

## Key Components

- `app/dashboard/*` - Admin dashboard pages for product and category management
- `app/shop/*` - Public-facing shop pages
- `components/ProductForm.tsx` - Reusable form for product creation/editing
- `components/ProductTable.tsx` - Display and manage products in a table
- `lib/api.ts` - API utility functions
- `lib/imageUpload.ts` - Image upload functionality
- `lib/store.ts` - Redux store configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:
```
# Add your environment variables here
# Database configuration
# Authentication secrets
# API endpoints
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - state management

## License

This project is licensed under the MIT License.
