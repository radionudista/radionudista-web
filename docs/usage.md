# Usage

This document explains how to run, build, and lint the application.

## Development Server

To start the development server, run the following command:

```bash
bun run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:5173` by default. The server features Hot Module Replacement (HMR), so it will automatically reload when you make changes to the source code.

## Building the Application

The project is configured with multiple build modes to cater to different environments. The build output is placed in the `dist/` directory.

### Development Build

```bash
bun run build:dev
```

This command uses the `vite build --mode development` command, which typically uses the environment variables defined in `.env.development`. This build is not minified and may contain debugging information, making it suitable for testing on a staging server.

### Feature Build

```bash
bun run build:feature
```

This command runs `vite build --mode feature`. It's intended for building a specific feature branch for isolated testing. It will use variables from `.env.feature`.

### Production Build

```bash
bun run build
```

or

```bash
bun run build:production
```

This command executes `vite build --mode production`. It creates a production-ready, optimized, and minified build of the application. It uses environment variables from `.env.production`. This is the command you should use when you are ready to deploy the application.

## Previewing the Production Build

After running the production build, you can preview it locally using the following command:

```bash
bun run preview
```

This will serve the `dist` folder, allowing you to check the production build before deploying it.

## Linting

To check the code for linting errors and style issues, run:

```bash
bun run lint
```

This command uses ESLint to analyze the codebase based on the rules defined in `eslint.config.js`. It's good practice to run this command before committing your code.

