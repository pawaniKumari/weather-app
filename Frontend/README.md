# Weather App

A full-stack weather application with a React + Vite frontend and a Node.js/Express backend. Auth0 is used for authentication.

## Features

- View weather data for cities
- Auth0 authentication for secure access
- Responsive UI with Tailwind CSS

## Project Structure

- `Frontend/`: React app (Vite, Tailwind, Auth0)
- `Backend/`: Node.js/Express API

## Getting Started

### Backend

1. Install dependencies:
   ```
   cd ../Backend
   npm install
   ```
2. Create a `.env` file in `Backend/` with:
   ```
   PORT=your-backend-running-port
   FRONTEND_ORIGIN=your-frontend-origin
   OPENWEATHER_API_KEY=your-openweather-api-key
   ```
3. Start the server:
   ```
   node server.js
   ```

### Frontend

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in `Frontend/` with:
   ```
   VITE_API_PORT=your-backend-running-port
   VITE_AUTH0_DOMAIN=your-auth0-domain
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   ```
3. Start the frontend:
   ```
   npm run dev
   ```

## Auth0 Setup

- Sign up at [Auth0](https://auth0.com/)
- Create an application and API
- Use the provided domain, client ID, client secret, and audience in your `.env` files

## License

MIT
