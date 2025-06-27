# 💕 Kizuna - Find Your Soulmate Today

## 🚀 Live Demo

👉 [Live Preview](https://kizuna-77.vercel.app/)

![Kizuna Preview](src/app/opengraph-image.png)

> **#1 Dating App of 2025** - Connecting hearts and creating meaningful relationships through intelligent matching and real-time communication.

## 🌟 Features

### 💘 Core Dating Features

- **Smart Compatibility Matching** - AI-powered algorithm that learns your preferences
- **Verified Profiles** - All profiles are verified to ensure you're meeting real people
- **Photo Sharing** - Share multiple photos to showcase your personality
- **Like & Match System** - Simple swipe-based matching with mutual like notifications
- **Real-time Chat** - Instant messaging with Pusher integration
- **Profile Management** - Complete profile customization with interests and preferences

### 🎨 Design & UX

- **Neubrutalism Theme** - Bold, modern design with thick borders and vibrant colors
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered interactions
- **Accessible UI** - Built with accessibility in mind

### 🔐 Security & Authentication

- **BetterAuth Integration** - Secure authentication with multiple providers
- **Session Management** - Robust session handling and protection
- **Data Privacy** - Your personal information is protected

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - Latest React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### Backend & Database

- **Prisma ORM** - Type-safe database queries and migrations
- **PostgreSQL** - Reliable relational database
- **NextAuth.js** - Authentication solution

### Real-time Features

- **Pusher** - Real-time chat and notifications
- **WebSocket Integration** - Live messaging capabilities

### Deployment & Infrastructure

- **Vercel** - Optimized deployment platform
- **Cloudinary** - Image upload and optimization
- **Environment Variables** - Secure configuration management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Pusher account
- Cloudinary account
- BetterAuth setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShyamGuna77/Kizunna/tree/main
   cd kizuna
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/kizuna"

   # Authentication
   AUTH_SECRET="your-auth-secret"
   AUTH_URL="http://localhost:3000"

   # Pusher
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_KEY="your-pusher-key"
   PUSHER_SECRET="your-pusher-secret"
   PUSHER_CLUSTER="your-pusher-cluster"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 App Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   ├── dashboard/         # User dashboard
│   ├── match/            # Matching system
│   ├── messages/         # Chat interface
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── ...
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication config
│   ├── pusher.ts         # Real-time setup
│   └── ...
└── generated/            # Generated files
```

## 🎯 Key Features Explained

### Smart Matching Algorithm

Our AI-powered matching system analyzes user preferences, interests, and behavior patterns to suggest compatible matches. The algorithm learns from user interactions to improve recommendations over time.

### Real-time Chat System

Built with Pusher, the chat system provides instant messaging with features like:

- Real-time message delivery
- Typing indicators
- Message status (sent, delivered, read)
- File and image sharing

### Profile Management

Users can create comprehensive profiles including:

- Multiple photos with drag-and-drop upload
- Personal interests and hobbies
- Relationship goals and preferences
- Location and basic information

### Security Features

- **BetterAuth Integration** - Secure authentication with multiple providers
- **Profile Verification** - Ensures real users and reduces fake profiles
- **Data Encryption** - All sensitive data is encrypted
- **Rate Limiting** - Prevents abuse and spam

## 🎨 Design Philosophy

Kizuna follows the **Neubrutalism** design trend, characterized by:

- **Bold Colors** - Vibrant pinks, purples, and gradients
- **Thick Borders** - Heavy black borders for strong visual impact
- **High Contrast** - Clear typography and accessible color combinations
- **Playful Elements** - Rounded corners, shadows, and interactive animations

## 📊 Database Schema

The app uses Prisma ORM with the following main models:

- **User** - Authentication and basic user info
- **Member** - Dating profile information
- **Photo** - User photos and media
- **Like** - Matching and likes system
- **Message** - Chat messages and conversations

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Database Setup

1. Set up PostgreSQL database (recommended: Supabase or Railway)
2. Run Prisma migrations: `npx prisma db push`
3. Seed initial data: `npx prisma db seed`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent ORM
- **Pusher Team** - For real-time communication
- **BetterAuth Team** - For secure authentication
- **Tailwind CSS Team** - For the utility-first CSS framework

---

<div align="center">
  <p>Made with ❤️ by the Kizuna Team</p>
  <p>Find your soulmate today at <a href="https://kizuna.com">kizuna.com</a></p>
</div>
