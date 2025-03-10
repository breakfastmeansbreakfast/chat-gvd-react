# Golden Valley AI Assistant Frontend

A modern React frontend for the Golden Valley AI Assistant, built with Vite and Tailwind CSS.

## Features

- 🚀 Built with Vite for fast development and builds
- 🎨 Styled with Tailwind CSS for a clean, responsive design
- 💬 Real-time chat interface with message history
- 📝 Support for customizing prompts with tone and platform modifiers
- 📁 Document upload functionality
- 🔄 Trello integration with synchronization status

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (see main project repository)

## Getting Started

1. Clone this repository:
```bash
git clone <your-repo-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
/src
  /components       # UI components
  /services         # API services
  App.jsx           # Main application component
  main.jsx          # Application entry point
  index.css         # Global styles with Tailwind
```

## Backend Integration

This frontend is designed to work with the Golden Valley AI Assistant backend. Make sure your backend server is running and the `VITE_API_URL` environment variable is set correctly.

## Environment Variables

- `VITE_API_URL`: URL of the backend API server (default: http://localhost:3000/api)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request