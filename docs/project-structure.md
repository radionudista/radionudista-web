# Project Structure

This project follows a standard structure for a Vite-based React application. The organization is designed to be modular and scalable.

```
/
├── dist/                 # Build output directory
├── docs/                 # Detailed project documentation
├── public/               # Static assets (images, fonts, videos)
├── src/                  # Source code
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...           # Custom application components
│   ├── config/           # Environment-specific configurations
│   ├── constants/        # Application-wide constants
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── pages/            # Top-level page components for routing
│   ├── utils/            # General utility scripts
│   ├── App.tsx           # Main App component with routing setup
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and Tailwind directives
├── .env.example          # Example environment variables file
├── .eslintrc.cjs         # ESLint configuration
├── package.json          # Project metadata and dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript compiler options
└── vite.config.ts        # Vite configuration file
```

## Key Directories

-   **`docs/`**: Contains all the detailed documentation for the project, written in Markdown. This includes guides for getting started, usage, components, and more.

-   **`public/`**: This directory contains static assets that are not processed by the build tool. Files here are copied to the root of the `dist` directory as-is. This is suitable for `robots.txt`, favicons, and images that are referenced directly.

-   **`src/`**: This is where all the application's source code resides.
    -   **`components/`**: This is the heart of the React application.
        -   `ui/`: Contains the UI components from the Shadcn UI library. These are foundational blocks for the user interface.
        -   Custom components like `CountdownTeaser.tsx` and `TwitchPlayer.tsx` are placed directly in `components/`. These components often contain more business logic.
    -   **`config/`**: Holds configuration files, such as environment variable setup (`env.ts`).
    -   **`contexts/`**: For React Context providers that manage global state, like `DebugContext.tsx`.
    -   **`hooks/`**: Contains custom React hooks that encapsulate reusable logic (e.g., `useCountdown.ts`).
    -   **`lib/`**: Home for utility functions, especially those that are shared across multiple components. `utils.ts` from Shadcn is a good example.
    -   **`pages/`**: Contains components that represent entire pages, which are then mapped to routes in `App.tsx`.
    -   **`utils/`**: A place for miscellaneous utility scripts and modules that don't fit into other categories.
    -   **`App.tsx`**: The root component of the application. It sets up the main providers (QueryClient, TooltipProvider) and defines the application's routing using `react-router-dom`.
    -   **`main.tsx`**: The entry point of the application. It renders the `App` component into the DOM.

