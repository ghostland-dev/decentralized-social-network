# Nostr Social Network

A decentralized social network built on the Nostr protocol, offering users complete control over their data and social interactions.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Nostr Protocol](https://img.shields.io/badge/Protocol-Nostr-purple?style=for-the-badge)](https://github.com/nostr-protocol/nostr)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 🚀 Features

- **Decentralized Architecture**: No central server, your data lives on the Nostr network
- **Self-Sovereign Identity**: Use your own cryptographic keys for authentication
- **Real-time Updates**: Live feed updates using WebSocket connections
- **End-to-End Encryption**: Private messages are encrypted using NIP-04
- **Lightning Integration**: Native support for Bitcoin Lightning tips (Zaps)
- **Rich Interactions**: Like, repost, comment, and zap posts
- **Profile Management**: Customizable profiles with metadata
- **Relay Management**: Connect to multiple Nostr relays
- **Dark Mode**: Built-in theme support
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/ui
- **Nostr Library**: nostr-tools
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- A Nostr private key (optional, can be generated in-app)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nostr-social-network.git
cd nostr-social-network
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see Configuration section)

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ⚙️ Configuration

Create a `.env.local` file based on `.env.example`:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Nostr Relays (comma-separated)
NEXT_PUBLIC_NOSTR_RELAYS=wss://relay.damus.io,wss://relay.nostr.band,wss://nos.lol

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=false
NEXT_PUBLIC_ENABLE_WEBLN=true

# Cache Configuration (milliseconds)
NEXT_PUBLIC_PROFILE_CACHE_TTL=600000
NEXT_PUBLIC_EVENT_CACHE_TTL=300000

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)

### Docker

1. Build the Docker image:
```bash
docker build -t nostr-social-network .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env.local nostr-social-network
```

### Manual Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Production Checklist

- [x] Environment variables configured
- [x] Error logging and monitoring set up
- [x] Performance optimizations enabled
- [x] Security headers configured
- [x] SSL/TLS certificate installed
- [x] CDN configured for static assets
- [x] Database backups configured (if applicable)
- [x] Rate limiting implemented
- [x] WebSocket connections optimized

## 🔒 Security Considerations

1. **Private Keys**: Never share your private keys. Store them securely.
2. **Content Validation**: All user input is validated and sanitized.
3. **CORS**: Configure appropriate CORS policies for your domain.
4. **Rate Limiting**: Implement rate limiting to prevent abuse.
5. **Content Security Policy**: Use strict CSP headers.

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if the relay URLs are accessible
   - Verify firewall settings
   - Ensure WSS protocol is supported

2. **Login Issues**
   - Verify private key format (64 character hex)
   - Clear browser cache and cookies
   - Check browser console for errors

3. **Performance Issues**
   - Reduce number of connected relays
   - Enable caching
   - Use production build

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nostr Protocol](https://github.com/nostr-protocol/nostr)
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

## 📞 Support

- Create an issue on GitHub
- Join our Nostr community
- Email: support@your-domain.com

---

Built with ❤️ for the decentralized web
