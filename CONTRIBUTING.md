# Contributing to dotUI

Contributions are what makes the open source community such an amazing place to learn, inspire, and create. Your contributions to this project are not just welcome, but deeply valued. We sincerely appreciate every effort you make to improve and enhance dotUI.

Please take a moment to review this document before starting your contribution.

## How to contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/mehdibha/dotUI/issues/new/choose) describing the problem you would like to solve.

This project requires:

- [Node.js](https://nodejs.org) v24.11.1 or higher
- [pnpm](https://pnpm.io) v10.24.0 or higher

```bash
npm install -g pnpm@10.24.0
```

### Setup your environment locally

1. Fork the repository by clicking the fork button in the top right corner of this page.

2. Clone the repository on your local machine

```bash
git clone https://github.com/your-username/dotui.git
```

3. Create a new branch

```bash
git checkout -b my-new-branch
```

4. Install the dependencies

```bash
pnpm install
```

### Project structure

This project is a [Turborepo](https://turborepo.org/) monorepo:

- `www/` - Documentation website
- `packages/` - Shared packages
  - `api` - API utilities
  - `auth` - Authentication
  - `colors` - Color utilities
  - `core` - Core functionality
  - `db` - Database utilities
  - `registry` - Component registry
  - `tailwindcss-autocontrast` - Tailwind CSS plugin for auto contrast
  - `tailwindcss-with` - Tailwind CSS plugin utilities
  - `types` - Shared TypeScript types

### Useful scripts

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `pnpm dev`           | Starts all packages in development mode    |
| `pnpm dev:www`       | Starts the documentation website           |
| `pnpm build`         | Builds all packages                        |
| `pnpm build:www`     | Builds the documentation website           |
| `pnpm build:registry`| Builds the component registry              |
| `pnpm check`         | Checks code for formatting and linting     |
| `pnpm check:fix`     | Fixes formatting and linting issues        |
| `pnpm typecheck`     | Runs TypeScript type checking              |
| `pnpm test`          | Runs tests                                 |

### Before submitting

Check that your code passes all checks:

```bash
pnpm check
pnpm typecheck
pnpm test
```

## Credits

This document was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md).
