# Nostr Social Network

A decentralized social network built on the Nostr protocol with Next.js 15 and React 19.

## Features

- 🔐 **Decentralized Authentication** - Use your Nostr keys to log in
- 📝 **Post Creation** - Share thoughts with the decentralized network
- 💬 **Direct Messages** - Encrypted peer-to-peer messaging
- ⚡ **Zaps** - Send and receive Lightning Network payments
- 👤 **Profile Management** - Customize your profile and manage your relays
- 🔔 **Real-time Notifications** - Stay updated with interactions
- 🌐 **Multi-relay Support** - Connect to multiple Nostr relays

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **Nostr**: nostr-tools for protocol implementation
- **Lightning**: WebLN support for zaps
- **TypeScript**: Fully typed codebase

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nostr-social-network.git
cd nostr-social-network
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `NEXT_PUBLIC_DEFAULT_RELAYS` - Comma-separated list of Nostr relay URLs
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Production URL

### Relays

The application connects to multiple Nostr relays by default:
- wss://relay.damus.io
- wss://relay.nostr.band
- wss://nos.lol
- wss://relay.snort.social

Users can add or remove relays in the settings page.

## Development

### Project Structure

```
.
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── feed/             # Post feed components
│   ├── messages/         # Direct messaging
│   ├── profile/          # User profile components
│   ├── settings/         # Settings pages
│   ├── ui/               # Reusable UI components
│   └── zaps/             # Lightning zap components
├── contexts/             # React contexts (Nostr)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── nostr/           # Nostr protocol implementation
└── public/               # Static assets
```

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Security

⚠️ **Important Security Notes**:

1. **Private Keys**: Never share your private key (nsec). Store it securely.
2. **Local Storage**: Keys are stored in browser localStorage. Consider using a browser extension like Alby or nos2x for better security.
3. **HTTPS**: Always use HTTPS in production to protect your keys during transmission.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Nostr Resources

- [Nostr Protocol](https://github.com/nostr-protocol/nostr)
- [NIPs (Nostr Implementation Possibilities)](https://github.com/nostr-protocol/nips)
- [Nostr Tools](https://github.com/nbd-wtf/nostr-tools)

## Deployment

This application is ready to be deployed on:

- **Vercel** (recommended) - Zero configuration deployment
- **Netlify** - Supports Next.js applications
- **Self-hosted** - Using Docker or standard Node.js deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Support

For support and questions:
- Open an issue on GitHub
- Join the Nostr community
- Follow the project maintainers on Nostr

---

Built with ⚡ using Nostr and Lightning Network
