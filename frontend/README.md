# MiniEcommerce Frontend Documentation

This folder contains the frontend application for MiniEcommerce, built with [Next.js](https://nextjs.org), [React](https://react.dev), and [TypeScript](https://www.typescriptlang.org/). It provides a modern, responsive user interface for customers and administrators.

---

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
	 - `npm install`
3. **Configure environment variables**
	 - Create a `.env.local` file in `frontend/` with:
		 ```env
		 NEXT_PUBLIC_API_URL=http://localhost:8000
		 ```
4. **Start the development server**
	 - `npm run dev`
5. **Build for production**
	 - `npm run build && npm start`

---

## API Usage Example

- **Fetch products:**
	```ts
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
	const products = await res.json();
	```
- **Add to cart:**
	```ts
	await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, { product_id, quantity });
	```

---

## Testing

- **Run lint checks:**
	- `npm run lint`
- **Type checking:**
	- `npm run type-check`
- **(Optional) Add Jest or Cypress for unit/e2e tests.**

---

## Customization & Extending

- Add new pages in `app/` for new features.
- Create new contexts in `context/` for global state.
- Extend UI by adding components in `components/`.
- Update API logic in `lib/api.ts` for new endpoints.

---

## Accessibility & Performance

- Follows accessibility best practices (semantic HTML, ARIA attributes).
- Uses Next.js server components and lazy loading for performance.
- Optimize images in `public/` and use Next.js `<Image />` for responsive images.

---

## Deployment

- Deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js.
- Set environment variables in deployment platform for API URLs.

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Features
...existing code...


# MiniEcommerce Frontend Documentation

This folder contains the frontend application for MiniEcommerce, built with [Next.js](https://nextjs.org), [React](https://react.dev), and [TypeScript](https://www.typescriptlang.org/). It provides a modern, responsive user interface for customers and administrators.

## Technical Overview

- **Architecture**: The frontend uses the Next.js App Router for file-based routing and server/client component separation. Pages are organized by feature and role (user, admin).
- **State Management**: React Context API is used for global state (authentication, cart). Contexts are initialized in `context/` and provided at the top level in `app/layout.tsx`.
- **API Communication**: All data is fetched from the backend using RESTful endpoints via Axios and native fetch. API URLs are managed through environment variables for flexibility.
- **Authentication**: JWT tokens are stored in cookies for session persistence. AuthContext parses cookies and provides login/logout methods. Protected routes check authentication and user roles before rendering.
- **Styling**: Tailwind CSS is used for utility-first styling, enabling rapid prototyping and consistent design. Custom classes are used for branding and layout.
- **Type Safety**: TypeScript interfaces in `types/` ensure consistent data structures for users, products, carts, and orders.
- **Component Design**: UI components are modular and reusable, following atomic design principles. Components are located in `components/` and `components/ui/`.
- **Error Handling**: User feedback is provided via react-hot-toast notifications for success, error, and loading states.
- **Performance**: Uses Next.js server components for data fetching where possible, reducing client-side load and improving SEO.

## Data Flow Example

1. **Product Fetching**: The homepage (`app/page.tsx`) uses an async server component to fetch products from the backend API and passes them to `ProductCard` components for display.
2. **Cart Operations**: Cart actions (add, remove, update) are handled in `CartContext.tsx`, which updates state and persists changes locally. Cart data is sent to the backend when placing orders.
3. **Authentication**: On login/register, AuthContext stores the JWT token and user info in cookies, updates context state, and redirects the user. Protected pages check context for authentication before rendering.
4. **Admin Features**: Admin pages in `app/admin/` fetch and manage products, orders, and users. Access is restricted based on user role from AuthContext.

## Key Implementation Choices

- **Next.js App Router**: Chosen for its flexibility, file-based routing, and support for server components.
- **React Context over Redux**: Context API is sufficient for the app's state needs, reducing boilerplate and complexity.
- **TypeScript**: Ensures type safety and reduces runtime errors, especially for API data and context values.
- **Tailwind CSS**: Enables rapid UI development and easy customization.
- **Axios + fetch**: Used for API calls, allowing both client and server-side data fetching.

## Security Considerations

- JWT tokens are stored in HttpOnly cookies to prevent XSS attacks.
- Sensitive admin routes are protected by role checks in AuthContext and route guards.
- User input is validated both client-side and server-side.


## Deployment & Environment Setup

- **Environment Variables**: API endpoints and secrets are managed via `.env.local`. Example:
	- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- **Production Build**: Run `npm run build` to generate an optimized production build. Start with `npm start`.
- **Static Assets**: Place images and icons in the `public/` folder for direct access.

## Extensibility & Customization

- **Adding Features**: New pages can be added in the `app/` directory. New global states can be managed by creating additional contexts in `context/`.
- **Component Reuse**: UI components are designed to be easily reused and extended. Follow the pattern in `components/` for new elements.
- **API Expansion**: To add new backend endpoints, update `lib/api.ts` and corresponding context logic.

## Troubleshooting & Tips

- **Common Issues**:
	- API not reachable: Check `NEXT_PUBLIC_API_URL` and backend server status.
	- Styling issues: Ensure Tailwind CSS is properly configured in `postcss.config.mjs` and `globals.css`.
	- Type errors: Run `npm run lint` and fix TypeScript issues as reported.
- **Debugging**:
	- Use browser dev tools and React DevTools for inspecting state and component trees.
	- Console logs are used throughout contexts and API calls for easier debugging.

## Contribution Guidelines

- Follow code style enforced by ESLint and Prettier.
- Write clear comments for complex logic and new features.
- Test new features thoroughly before merging.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Features

- **Product Browsing**: Users can view all products, see details, and search for items.
- **Product Details**: Each product has a dedicated page with images, description, price, and stock info.
- **Cart Management**: Add, remove, and update products in the shopping cart. Cart state is managed globally.
- **Order Placement**: Users can place orders for products in their cart and view order history.
- **User Authentication**: Registration and login pages for secure access. Auth state is managed via cookies and React Context.
- **Admin Dashboard**: Admins can manage products, view orders, and manage users from dedicated admin pages.
- **Responsive Design**: Mobile-friendly layouts using Tailwind CSS.
- **Global State Management**: Uses React Context for authentication and cart state.
- **API Integration**: Communicates with the backend via REST API for products, cart, orders, and authentication.
- **Reusable Components**: Includes Navbar, ProductCard, EmptyState, LoadingSpinner, and more for consistent UI.
- **Notifications**: Uses react-hot-toast for user feedback (e.g., success/error messages).
- **Secure Routing**: Protects admin routes and user-specific pages based on authentication and roles.

## Folder Structure

- `app/` - Main application pages and layouts
	- `page.tsx` - Home page, displays featured products
	- `(auth)/login/page.tsx` & `(auth)/register/page.tsx` - User authentication
	- `cart/page.tsx` - Shopping cart
	- `order/page.tsx` - Order history and details
	- `products/page.tsx` & `products/[id]/page.tsx` - Product listing and details
	- `admin/` - Admin dashboard and management pages
- `components/` - Reusable UI components
	- `Navbar.tsx` - Top navigation bar
	- `ProductCard.tsx` - Product display card
	- `ui/` - Utility components (EmptyState, Image, LoadingSpinner)
- `context/` - React Contexts for global state
	- `AuthContext.tsx` - Authentication state and logic
	- `CartContext.tsx` - Cart state and logic
- `lib/api.ts` - Centralized API calls to backend
- `types/` - TypeScript type definitions
- `public/` - Static assets
- `globals.css` - Global styles

## How It Works

1. **Homepage**: Fetches products from backend and displays featured items.
2. **Authentication**: Users register/login, with state managed via cookies and React Context.
3. **Cart**: Users add products to cart, update quantities, and proceed to checkout.
4. **Orders**: Users place orders and view their order history.
5. **Admin**: Admins manage products, orders, and users via protected routes.
6. **State Management**: Auth and cart states are available throughout the app using Context.
7. **API Communication**: All data is fetched and updated via REST API endpoints.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js. See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- js-cookie
- Lucide React
- react-hot-toast

## For Thesis Writing

This documentation covers all major features and the structure of the frontend. Each feature is implemented with best practices for scalability, maintainability, and user experience. For more details on specific files or logic, refer to the source code and comments within each file.
