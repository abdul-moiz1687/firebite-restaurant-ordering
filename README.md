# 🔥 Firebite — AI-Powered Restaurant Ordering Platform

A modern, responsive full-stack restaurant ordering application built with **Next.js 16, React 19, Firebase and Google Gemini AI**.

Firebite allows customers to explore restaurant menus, discover food options, manage their shopping cart and place orders. It also includes an admin dashboard for order management and an AI-powered food assistant for personalized menu recommendations.

## 🌐 Live Demo & Source Code

- **Live Website:** https://firebite-restaurant-ordering.vercel.app/
- **GitHub Repository:** https://github.com/abdul-moiz1687/firebite-restaurant-ordering

## ✨ Features

### Customer Experience
- Responsive restaurant homepage.
- Browse food items by category.
- View menu item details and prices.
- Add and manage cart items.
- Delivery and pickup checkout.
- Delivery location selection.
- Order tracking.
- Restaurant information and offers.

### 🤖 AI Food Assistant
Powered by Google Gemini API.

- Conversational AI chatbot.
- Food recommendations based on customer budgets.
- Menu item comparisons.
- Real-time menu context from the application's menu data.
- English and Roman Urdu conversations.
- Responsive floating chat interface.
- Helpful answers based on actual menu items and prices.

The assistant provides recommendations only. It does not automatically modify the cart or place orders.

### Admin Dashboard
- Admin authentication.
- Dashboard interface.
- View and manage customer orders.
- Order status management.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack framework |
| React 19 | Frontend UI |
| JavaScript | Application logic |
| Tailwind CSS 4 | Styling |
| Firebase | Database and authentication |
| Firebase Admin SDK | Server-side operations |
| Google Gemini API | AI food assistant |
| Upstash Redis | Rate limiting |
| Upstash Rate Limit | API request protection |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Vercel | Deployment |

## 🧠 AI Architecture

The chatbot communicates with Gemini through a server-side Next.js Route Handler.

```text
Customer Chat Interface
        |
        v
Next.js API Route
/api/ai/chat
        |
        v
Request Validation
        |
        v
Upstash Rate Limiting
        |
        v
Google Gemini API
        |
        +---- Firebite Menu Data
        |
        v
AI Generated Response
        |
        v
Customer Chat Interface
```

The backend provides actual Firebite menu information to Gemini so that recommendations and prices are grounded in the restaurant's menu.

## 🔐 Security

- API keys stored in environment variables.
- Environment files excluded from Git.
- Server-side AI API integration.
- Upstash Redis rate limiting.
- Input and message validation.
- Conversation history limits.
- AI response token limits.
- API request timeout.
- Server-side verification of product IDs, prices and order quantities.
- Admin dashboard separated from the customer-facing chatbot.

## 📁 Project Structure

```text
restaurant-ordering-app/
│
├── app/
│   ├── admin/
│   ├── api/
│   │   ├── admin/
│   │   ├── orders/
│   │   └── ai/
│   │       └── chat/
│   │           └── route.js
│   ├── cart/
│   ├── checkout/
│   ├── menu/
│   ├── our-story/
│   ├── track-order/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── about/
│   ├── ai/
│   │   └── FirebiteChat.jsx
│   ├── cart/
│   ├── checkout/
│   ├── home/
│   ├── layout/
│   ├── location/
│   ├── menu/
│   └── ui/
│
├── context/
├── data/
├── lib/
├── public/
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abdul-moiz1687/firebite-restaurant-ordering.git
```

### 2. Navigate to the project

```bash
cd firebite-restaurant-ordering
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

Add the following variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=

# Google Gemini AI
GEMINI_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Firebase Admin Credentials:** The server uses Google Application Default Credentials. Configure an appropriate service-account credential in your local and deployment environment. Never commit service-account JSON files or private credentials.

**Important:** Replace the empty values with your own credentials. Never share actual API keys or commit `.env.local` to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

## ☁️ Deployment

The application is deployed using Vercel.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Deploy the application.
4. Verify customer pages, admin dashboard, ordering functionality and AI chatbot.

## 👨‍💻 Developer

**Abdul Moiz**

Full-Stack JavaScript Developer | AI Application Development

- GitHub: https://github.com/abdul-moiz1687
- LinkedIn: https://www.linkedin.com/in/abdul-moiz-5108b3391

## 📌 Project Purpose

Firebite was developed as a practical portfolio project to demonstrate modern full-stack web development, API integration, Firebase services, authentication, application security and AI-powered user experiences.

**Built with passion for learning and real-world development. 🔥**