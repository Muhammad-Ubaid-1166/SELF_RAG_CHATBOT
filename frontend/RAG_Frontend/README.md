# RAG Frontend

A modern React frontend for a Retrieval-Augmented Generation (RAG) chatbot application.

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Markdown** - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Base URL for the RAG backend API | Yes |

## Vercel Deployment

This project is configured for easy deployment to Vercel.

### Quick Deploy

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add the environment variable `VITE_API_BASE_URL` in Vercel Project Settings > Environment Variables
4. Deploy!

### Manual Vercel CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

The project includes a `vercel.json` with:

- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: All routes redirect to `index.html`
- **Caching**: Static assets cached for 1 year

### Environment Variables in Vercel

Go to your Vercel Project Settings > Environment Variables and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | `https://your-backend-api.example.com` | Production, Preview, Development |

## Project Structure

```
src/
├── components/
│   ├── ChatInput.jsx      # Message input component
│   ├── ChatMessage.jsx    # Message display component
│   └── SourceCard.jsx     # Source document card
├── hooks/
│   └── useAskRag.js       # Main RAG logic hook
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## API Integration

The frontend expects a backend with the following endpoint:

### POST `/ask`

**Request:**
```json
{
  "question": "Your question here"
}
```

**Response:**
```json
{
  "answer": "The generated answer",
  "context": "Context used for generation",
  "relevant_docs": [
    {
      "content": "Document content",
      "metadata": {},
      "score": 0.95
    }
  ]
}
```

## License

MIT