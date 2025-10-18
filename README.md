# Nostr Social Network

Un réseau social décentralisé construit sur le protocole Nostr, offrant une alternative libre et ouverte aux plateformes centralisées.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🚀 Fonctionnalités

- **Décentralisé** : Aucun serveur central, vos données vous appartiennent
- **Cryptographie** : Authentification et chiffrement basés sur des clés privées
- **Open Source** : Code source entièrement ouvert et auditable
- **Moderne** : Interface utilisateur moderne et responsive
- **Sécurisé** : Headers de sécurité et protection contre les attaques courantes
- **Performant** : Optimisé pour la production avec lazy loading et caching

## 🛠️ Technologies

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS, Radix UI
- **Protocole** : Nostr (nostr-tools)
- **Tests** : Jest, Testing Library
- **Déploiement** : Vercel

## 📦 Installation

### Prérequis

- Node.js 18+ 
- pnpm (recommandé) ou npm

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/your-username/nostr-social-network.git
cd nostr-social-network

# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer les variables d'environnement
# Éditer .env.local avec vos valeurs

# Démarrer le serveur de développement
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` basé sur `.env.example` :

```env
# URL de l'application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Relais Nostr (optionnel)
NEXT_PUBLIC_NOSTR_RELAYS=wss://relay.damus.io,wss://relay.snort.social
```

### Relais Nostr

Par défaut, l'application utilise des relais publics. Vous pouvez configurer vos propres relais dans les variables d'environnement.

## 🚀 Déploiement

### Vercel (Recommandé)

1. Fork ce repository
2. Connectez votre compte Vercel
3. Importez le projet depuis GitHub
4. Configurez les variables d'environnement
5. Déployez !

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nostr-social-network)

### Autres plateformes

L'application peut être déployée sur n'importe quelle plateforme supportant Next.js :

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Tests

```bash
# Lancer tous les tests
pnpm test

# Tests en mode watch
pnpm test:watch

# Tests avec couverture
pnpm test:coverage
```

## 📊 Performance

L'application est optimisée pour la production avec :

- **Lazy Loading** : Chargement différé des composants
- **Image Optimization** : Optimisation automatique des images
- **Bundle Splitting** : Division intelligente du code
- **Caching** : Mise en cache des ressources statiques
- **Compression** : Compression gzip/brotli

## 🔒 Sécurité

- **CSP** : Content Security Policy strict
- **Headers de sécurité** : Protection contre XSS, clickjacking, etc.
- **HTTPS** : Redirection automatique en production
- **Rate Limiting** : Protection contre les abus

## 📝 Scripts disponibles

```bash
# Développement
pnpm dev          # Serveur de développement
pnpm build        # Build de production
pnpm start        # Serveur de production
pnpm lint         # Linter ESLint

# Tests
pnpm test         # Tests unitaires
pnpm test:watch   # Tests en mode watch
pnpm test:coverage # Tests avec couverture

# Production
pnpm build        # Build optimisé
pnpm start        # Serveur de production
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Nostr](https://nostr.com/) - Protocole décentralisé
- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Composants UI accessibles

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/your-username/nostr-social-network/issues)
- **Discussions** : [GitHub Discussions](https://github.com/your-username/nostr-social-network/discussions)
- **Email** : support@your-domain.com

---

Fait avec ❤️ par l'équipe Nostr Social Network
