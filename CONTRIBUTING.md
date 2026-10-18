# Contributing to dotUI

Contributions are what makes the open source community such an amazing place to learn, inspire, and create. Your contributions to this project are not just welcome, but deeply valued. We sincerely appreciate every effort you make to improve and enhance dotUI.

Please take a moment to review this document before starting your contribution.

## How to contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/mehdibha/dotUI/issues/new/choose) describing the problem you would like to solve.

This project requires:

- [Node.js](https://nodejs.org) v24 (v24.11.1 or higher)
- [pnpm](https://pnpm.io) v11.5.3 or higher

```bash
npm install -g pnpm@latest
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

5. Start the dev server (it builds the component registry first)

```bash
pnpm dev:www
```

### Project structure

This project is a [Turborepo](https://turborepo.org/) monorepo. [CLAUDE.md](CLAUDE.md) describes it in depth.

- `www/` - dotui.org: the docs, the /studio builder, and the registry endpoints. Registry source lives in `www/src/registry/`.
- `packages/` - Shared packages
  - `colors` - `@dotui/colors`, the OKLCH color engine
  - `ts-config` - Shared TypeScript configs
- `examples/` - Consumer templates with the registry's resolved output committed (generated, never hand-edited; see [examples/README.md](examples/README.md))
- `video/` - The launch film, made with Remotion (see [video/README.md](video/README.md))

### Useful scripts

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `pnpm dev:www`        | Starts the dev server (builds registry) |
| `pnpm build`          | Builds all packages                     |
| `pnpm build:www`      | Builds the website                      |
| `pnpm build:registry` | Builds the component registry           |
| `pnpm check`          | Runs lint and format checks             |
| `pnpm check:fix`      | Fixes lint, format and Tailwind classes |
| `pnpm typecheck`      | Runs TypeScript type checking           |
| `pnpm test`           | Runs every Vitest test in the repo      |

### Before submitting

Check that your code passes all checks:

```bash
pnpm check
pnpm typecheck
pnpm test
```

CI also fails on stale generated files. Depending on what you touched:

- `www/src/registry/` - run `pnpm build:registry` and commit the regenerated `__generated__/*` and `base/colors.css`.
- The registry, the publisher, presets, or `/r/*` - run `pnpm smoke:examples` and commit `examples/`.
- A component's `types.ts` - run `pnpm build:references` and commit `www/src/modules/docs/references/generated/`.

See the Workflow section of [CLAUDE.md](CLAUDE.md) for details.

## Credits

This document was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md).
