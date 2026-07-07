# Setup Guide

Local development setup for the Cartesi Explorer web app.

## Prerequisites

- **Node.js >= 20.19** (Node 22 LTS recommended). The dev toolchain
  (`eslint@9.39`, `@typescript-eslint@8.63`) requires Node `>=20.19`; older
  versions fail `yarn install` with an `eslint-visitor-keys` engine error.
- **Yarn** (Yarn 1 / Classic). The repo uses a `yarn.lock` v1 lockfile.

```bash
# with nvm
nvm install 22
nvm use 22

# install yarn if needed
npm install -g yarn
```

## Install dependencies

```bash
yarn install
```

## Run the app

This is a [Next.js](https://nextjs.org) application which uses smart contracts
deployed by the [solidity-util](https://github.com/cartesi/solidity-util)
project. To run against a local chain you need to:

- run the `solidity-util` local node with the contracts deployed
- deploy the `token` contracts to the local network
- deploy the `pos-dlib` smart contracts to the local network
- `yarn link` this project to the `solidity-util`, `pos-dlib`, and `token`
  projects so it uses the same build files with contract information
- generate the contract classes: `yarn install` (or `yarn run postinstall`)

Then start the dev server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start the Next.js dev server on port 3000. |
| `yarn build` | Production build. |
| `yarn start` | Serve the production build. |
| `yarn lint` | Run ESLint over `src/`. |
| `yarn lint:fix` | Run ESLint with `--fix`. |

## Formatting

CI checks formatting with Prettier:

```bash
npx prettier --check "src/**/*.ts"
```

Fix formatting issues with:

```bash
npx prettier --write "src/**/*.ts"
```

## Security / dependency audit

```bash
yarn audit
```

Remaining audited findings have no upstream fix available
(`@ensdomains/ens-contracts`, `elliptic`) and originate from the contract
tooling / ethers v5 signing path, not from code this app executes.
