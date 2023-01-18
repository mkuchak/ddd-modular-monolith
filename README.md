# DDD Modular Monolithic

This is a project aimed at exploring the use of no-configuration technologies such as `tsx` (executor), `tsup` (bundler), `vitest` (test), and `ity` (dependency injection) to develop software systems more easily and quickly. The project is built using Domain-Driven Design (DDD) principles and follows a modular monolithic architecture: for this, an organization of folders divided between modules and shared code is proposed.

Originally intended to be developed solely on Node.js, this project's design allows it to be deployed on Cloudflare Workers platform as well due to the decoupling of libraries with dependency inversion, facilitated by the ity using dependency injection in `src/shared/infra/container/index.ts`. Yes, inversion and dependency injection are implemented here. Check the integration tests! :)

## How to start

```bash
# copy .env.example to .env
cp .env.example .env

# install dependencies
npm install

# run development server
npm run dev

# run tests
npm run test
npm run test:coverage

# build for production
npm run build

# run production server
npm run start
```