# Contributing to Eduvanta Backend 🤝

Thank you for your interest in contributing to the Eduvanta Backend project! We welcome contributions from the community while maintaining the integrity and vision of this educational technology platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Project Vision](#project-vision)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Contribution Types](#contribution-types)
- [Pull Request Process](#pull-request-process)
- [License and Terms](#license-and-terms)
- [Contact](#contact)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our community standards:

- **Be Respectful**: Treat all contributors with respect and kindness
- **Be Collaborative**: Work together towards common goals
- **Be Constructive**: Provide helpful feedback and suggestions
- **Follow License Terms**: Respect the project's licensing and usage terms

## 🎯 Project Vision

This project is the **intellectual property** of [abhishek-nexgen-dev](https://github.com/abhishek-nexgen-dev) and represents a vision for modernizing educational technology in India.

### ⚠️ Important Guidelines:

- ✅ **Personal Use**: You can use this project for learning and add it to your resume
- ✅ **Open Source Contributions**: Contribute features, bug fixes, and improvements
- ❌ **No Commercial Hosting**: Don't host this as a commercial service
- ❌ **No Business Use**: Don't use this for profit without permission
- ❌ **No Idea Copying**: Don't copy the core concept for commercial purposes

## 🚀 How to Contribute

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Ciitm-Backend.git
cd Ciitm-Backend
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
# or for live reload
npm run start:dev
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

## 🛠️ Development Guidelines

### Code Style

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **ES6 Modules**: Use modern JavaScript/ES6+ features
- **Comments**: Write clear, concise comments for complex logic

### Naming Conventions

- **Files**: Use kebab-case for files (`user-controller.mjs`)
- **Functions**: Use camelCase (`getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_VERSION`)
- **Classes**: Use PascalCase (`UserService`)

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 📝 Contribution Types

### 🐛 Bug Fixes

- Fix existing bugs and issues
- Improve error handling
- Optimize performance

### ✨ New Features

- Add new educational features
- Improve user experience
- Enhance security measures

### 📚 Documentation

- Improve README and guides
- Add code comments
- Create API documentation

### 🎨 UI/UX Improvements

- Enhance frontend integration
- Improve responsive design
- Add accessibility features

### 🔧 Infrastructure

- Improve build processes
- Add CI/CD improvements
- Database optimizations

## 🔄 Pull Request Process

### Before Submitting

1. **Test Thoroughly**: Ensure your changes work correctly
2. **Run Tests**: All tests should pass
3. **Code Quality**: Follow linting rules
4. **Documentation**: Update relevant documentation

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing

- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

### Review Process

1. **Automated Checks**: Must pass all CI/CD checks
2. **Code Review**: Maintainer will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Maintainer approval required for merge

## 📜 License and Terms

By contributing to this project, you agree that:

1. **Your contributions** will be licensed under the same terms as the project
2. **You respect** the intellectual property of the project maintainer
3. **You understand** the non-commercial nature of this project
4. **You cooperate** with the maintainer's vision and guidelines

### Resume/Portfolio Use

✅ **You are encouraged to:**

- Add this project to your resume
- Showcase your contributions in your portfolio
- Mention your open-source contributions
- Use this as a learning experience

❌ **You must not:**

- Claim ownership of the project idea
- Use it for commercial purposes without permission
- Host it as a commercial service
- Copy the business model

## 🎓 Learning Opportunities

Contributing to this project provides valuable learning in:

- **Modern Node.js/Express.js** development
- **MongoDB** database design
- **Real-time communication** with Socket.io
- **Payment gateway** integration
- **Cloud services** (Cloudinary, Email services)
- **Authentication** and security
- **API design** and documentation

## 🚫 What We Don't Accept

- Contributions that violate the license terms
- Code that compromises security
- Features that don't align with educational purposes
- Contributions without proper testing
- Code that breaks existing functionality

## 🔍 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** and README first
3. **Provide clear reproduction steps** for bugs
4. **Include system information** (OS, Node.js version, etc.)

### Issue Templates

#### Bug Report

```markdown
**Bug Description**
A clear description of the bug

**Steps to Reproduce**

1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**

- OS: [e.g., Windows 11, Ubuntu 22.04]
- Node.js version: [e.g., 18.17.0]
- Browser: [if applicable]

**Additional Context**
Screenshots, logs, or additional information
```

#### Feature Request

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this be implemented?

**Educational Value**
How does this benefit the educational platform?

**Additional Context**
Mockups, examples, or references
```

## 🛡️ Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- **Email directly**: abhishek.nexgen.dev@gmail.com
- **Subject**: "Security Issue - CIITM Backend"
- **Include**: Detailed description and reproduction steps

### Security Best Practices

- Keep dependencies updated
- Follow OWASP guidelines
- Use secure coding practices
- Validate all inputs
- Implement proper authentication

## 🔧 Environment Setup Details

### Required Software

```bash
# Node.js (v18+ recommended)
node --version

# MongoDB (v6+ recommended)
mongod --version

# pnpm (recommended package manager)
pnpm --version
```

### IDE Setup (VS Code Recommended)

Install these extensions:

- ESLint
- Prettier
- MongoDB for VS Code
- REST Client (for API testing)

### Environment Variables

Create `.env` file with these variables:

```env
# Required
MONGO_URL=mongodb://localhost:27017/ciitm_dev
JWT_SECRET=your_development_secret
PORT=8000

# Optional for development
GMAIL_User=your_test_email@gmail.com
GMAIL_Password=your_app_password
Cloudinary_Cloud_Name=your_cloud_name
Cloudinary_API_Key=your_api_key
Cloudinary_API_Secret=your_api_secret
```

## 📚 Documentation Standards

### Code Documentation

- **Functions**: Document parameters and return values
- **Classes**: Document purpose and usage
- **Complex Logic**: Add inline comments
- **API Endpoints**: Document request/response format

### Documentation Example

```javascript
/**
 * Creates a new student admission record
 * @param {Object} admissionData - Student admission information
 * @param {string} admissionData.name - Student's full name
 * @param {string} admissionData.email - Student's email address
 * @param {File} admissionData.avatar - Student's profile picture
 * @returns {Promise<Object>} Created admission record
 * @throws {ValidationError} When required fields are missing
 */
async function createAdmission(admissionData) {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Test Structure

```bash
src/
├── __tests__/              # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── fixtures/          # Test data
```

### Writing Tests

```javascript
import { jest, describe, it, expect } from '@jest/globals';
import { createAdmission } from '../api/v1/Admission/Admission.controller.mjs';

describe('Admission Controller', () => {
  it('should create a new admission', async () => {
    // Test implementation
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Test both success and error cases
- Include edge cases
- Mock external dependencies

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Security audit completed
- [ ] Performance testing done

## 🌟 Best Practices

### Git Workflow

```bash
# Always start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push and create PR
git push origin feature/new-feature
```

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and pass
- [ ] Documentation is updated
- [ ] No sensitive data exposed
- [ ] Performance impact considered
- [ ] Backward compatibility maintained

## 🏆 Contributor Hall of Fame

We maintain a list of our top contributors:

### 🥇 Core Contributors

- [abhishek-nexgen-dev](https://github.com/abhishek-nexgen-dev) - Project Creator & Maintainer

### 🥈 Major Contributors

_Coming soon - your name could be here!_

### 🥉 Contributors

_All contributors are listed in [CONTRIBUTORS.md](CONTRIBUTORS.md)_

## 📊 Contribution Statistics

We track and celebrate:

- Lines of code contributed
- Issues resolved
- Features implemented
- Documentation improvements
- Community engagement

## 🎯 Monthly Focus Areas

We rotate focus areas monthly:

- **January**: Security & Performance
- **February**: Testing & Documentation
- **March**: New Features
- **April**: UI/UX Improvements
- **May**: Mobile & API Enhancements
- **June**: Accessibility & Internationalization
- **July**: DevOps & Infrastructure
- **August**: Bug Fixes & Optimization
- **September**: Community Features
- **October**: Analytics & Monitoring
- **November**: Integration & Plugins
- **December**: Year-end Cleanup & Planning

---

**Thank you for contributing to the future of education technology in India! 🇮🇳**

_This project is maintained with ❤️ by [abhishek-nexgen-dev](https://github.com/abhishek-nexgen-dev)_
