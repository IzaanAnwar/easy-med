# Next.js Project

Welcome to the Next.js project! This application is built with Next.js and TypeScript, integrating with various technologies and tools for a scalable and maintainable architecture.

## Project Structure

- `drizzle.config.ts`: Configuration file for Drizzle ORM.
- `.env.local`: Local environment variables configuration file.

### Directories

- `public/`: Public assets like images and static files.
- `src/`: Source code directory.
  - `app/`: Contains Next.js app components and pages.
    - `(superusers)/`: Contains pages for doctors and admins.
    - `(users)/`: Contains pages for patients.
    - `api/`: Contains API routes and handlers.
  - `components/`: Reusable UI components.
  - `db/`: Database-related code and schema.
  - `lib/`:Shared utility functions and libraries.
  - `services/`: Anything supporting the business logic or the ui components.
  - `supabase/`: Supabase integration code and configuration.

## Getting Started

To get started with the project, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 1. Install Dependencies

Install project dependencies using `pnpm`:

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a .env.local file in the root directory. This file will contain environment-specific variables required for the application. Here are the required variables:

# Database URL for Supabase

`DATABASE_URL=Supabae db url`

### 3. Start the Development Server

Start the development server using the following command:

```bash
pnpm dev
```

This will start the Next.js development server and open the application in your default browser.

## Contributing Guidelines

### Introduction

This document outlines the process for contributing to our codebase.

### Getting Started

1. **Fork the repository:** Create a fork of the main repository on GitHub.
2. **Clone your fork:** Clone your forked repository to your local machine.
3. **Create a new branch:** Create a new branch for your  
   feature or bug fix. Use descriptive branch names (e.g., `feature-add-new-feature`, `bugfix-issue-123`).

### Making Changes

- **Code style:** Adhere to the project's coding style and conventions.

- **Documentation:** Update documentation if necessary.

### Committing Changes

- **Commit messages:** Write clear and concise commit messages that describe the changes made.
- **Commit frequently:** Commit your changes frequently to avoid conflicts.

### Pushing Changes

- **Push to your fork:** Push your changes to your forked repository.

### Creating a Pull Request

- **Open a pull request:** Create a pull request from your branch to the main repository's `main` branch.
- **Provide details:** Clearly describe the changes made in the pull request description.
- **Address feedback:** Be open to feedback and make necessary changes.

### Additional Guidelines

- **Code of Conduct:** Adhere to the project's code of conduct.

By following these guidelines, you can contribute effectively to the project and help us create a better product. Thank you for your contributions!
