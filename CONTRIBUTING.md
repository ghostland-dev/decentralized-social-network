# Contributing to Nostr Social Network

Thank you for your interest in contributing to the Nostr Social Network! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](https://github.com/yourusername/nostr-social-network/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with the "enhancement" label
3. Provide:
   - Clear use case
   - Proposed solution
   - Alternative solutions considered
   - Mockups or examples (if applicable)

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests
5. Update documentation
6. Commit with clear messages: `git commit -m "feat: add new feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

#### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Maintenance tasks

### Development Setup

1. Clone your fork:
```bash
git clone https://github.com/yourusername/nostr-social-network.git
cd nostr-social-network
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Run development server:
```bash
npm run dev
```

5. Run tests:
```bash
npm test
```

### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` before committing
- Follow existing code patterns
- Add comments for complex logic
- Use TypeScript types properly

### Testing

- Write tests for new features
- Update tests when modifying existing features
- Ensure all tests pass: `npm test`
- Aim for good test coverage

## Review Process

1. All submissions require review
2. Changes may be requested
3. Be patient and responsive to feedback
4. Once approved, your PR will be merged

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to ask questions in:
- GitHub Issues
- Discussions
- Nostr community

Thank you for contributing to the decentralized web! \ud83d\ude80