# AGENTS.md: AI Agent Instructions

This document provides instructions for AI agents working on this project.

## Agent Operating Procedures

- **WIP Commits**: After each code modification, create a Work-in-Progress (WIP) commit to maintain a detailed history of changes.
- **Build Verification**: After any code modification, always ensure that `npm run build`, `npm run test`, `npm run format`, and `npm run lint` execute without generating any errors or warnings.
- **Prohibited Commands**: DO NOT execute commands that run indefinitely in the foreground, such as `npm run dev`, `yarn dev`, or `vite`. These commands block the agent's execution flow and cause the session to hang. Rely exclusively on `npm run build` to verify that the application compiles correctly.
- **Language**: Think and process information in English, but communicate with the user in Japanese.
- **Report Unintended Changes**: If any unintended modifications are found, report them to the user instead of fixing or reverting them without explicit instruction.

## Project Overview

This project is an SLO (Service Level Objective) and Error Budget Calculator web application. It allows users to define their SLO, input various parameters, and calculate error budgets and multi-burn rate alerting policies.

## Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Project Structure

- `src/index.html`: The main HTML file.
- `src/main.tsx`: The entry point of the React application.
- `src/components/`: Directory for React components.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Project dependencies and scripts.

## Development Commands

- **Build for production**: `npm run build`
- **Run tests**: `npm test`

## Coding Style and Conventions

- Follow standard React and TypeScript best practices.
- Use functional components with hooks.
- Use ES modules (`import`/`export`).
- Keep components small and focused on a single responsibility.
- Write component files in `.tsx`.
- Use descriptive names for variables, functions, and components.

## State Management

- For now, component-level state is managed with the `useState` hook.
- For more complex state, consider using React Context or a library like Zustand or Redux.

## Deployment

The project is deployed by building the static files and hosting them on a static web host.

- The build output is generated in the `dist` directory.
