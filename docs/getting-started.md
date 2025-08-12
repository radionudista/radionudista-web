
# Getting Started

Follow these steps to set up Nudista Radio Aura Glass for local development and testing.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Bun](https://bun.sh/) (or use npm/yarn if preferred)

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/kamansoft/nudista-radio-aura-glass.git
    cd nudista-radio-aura-glass
    ```
2. **Install dependencies:**
    ```bash
    bun install
    # or npm install
    ```
3. **Set up environment variables:**
    - Copy `.env.example` to `.env.local`, `.env.development`, or the appropriate file for your environment:
      ```bash
      cp .env.example .env.development
      ```
    - Edit the file and set values as needed. See [Environment Variables](./environment-variables.md) for details.

## Multilingual & Dynamic Content

- Content is managed as Markdown files in `src/content/{lang}/` (e.g., `src/content/es/`, `src/content/pt/`).
- Add new content or languages by creating new folders/files—no code changes required.
- Content is auto-indexed at build time and appears in navigation and routes.

## Running the App

Start the development server:
```bash
bun run dev
# or npm run dev
```
The app will be available at `http://localhost:5173` (or as configured).

---
For more, see [Usage & Build](./usage.md) and [Component Guide](./components-guide.md).

