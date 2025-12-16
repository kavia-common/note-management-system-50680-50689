# Ocean Notes - React Frontend

A lightweight React UI for managing notes with a modern "Ocean Professional" theme. Implements full CRUD with a FastAPI backend.

## Features

- List notes, view details, create, edit, and delete
- Loading skeletons and error messages
- Minimal dependencies, clean components and CSS
- Ocean Professional theme: blue primary, amber accent, clean surfaces, subtle gradients and shadows
- Environment-based backend URL via `REACT_APP_API_BASE`

## Getting Started

1. Optionally configure backend URL:
   - Copy `.env.example` to `.env` and set `REACT_APP_API_BASE` (default: `http://localhost:3001`)

2. Install and run:
   - `npm install`
   - `npm start`
   - Open http://localhost:3000

Ensure the backend (FastAPI) is running on the configured port and has CORS enabled for http://localhost:3000.

## Scripts

- `npm start` - Dev server
- `npm test` - Tests
- `npm run build` - Production build

## Theme

All theme variables and component styles are defined in `src/App.css`. The theme supports light/dark mode toggling in the header.
