# Project 8: L'Oréal Beauty Advisor Chatbot

An AI-powered chatbot that helps users discover L'Oréal products, build personalised skincare, haircare, makeup, and fragrance routines, and get expert beauty recommendations — all through a branded chat interface.

## Features

- **Conversational AI** — multi-turn chat powered by OpenAI's GPT-4o, with full conversation history so the AI remembers context across messages
- **Scoped responses** — system prompt constrains the AI to beauty and L'Oréal topics; off-topic questions are politely declined
- **Chat bubble UI** — distinct message bubbles for user (black, right-aligned) and advisor (cream/gold, left-aligned)
- **Secure API key** — OpenAI key never exposed to the browser; all requests route through a Cloudflare Worker proxy
- **L'Oréal branding** — logo, gold/black color palette, Montserrat typography

## Project Structure

```
08-prj-loreal-chatbot/
├── index.html                    # Chat interface markup
├── style.css                     # L'Oréal branded styles
├── script.js                     # Chat logic, API calls, conversation history
├── secrets.js                    # Local API key (never commit this)
├── RESOURCE_cloudflare-worker.js # Cloudflare Worker source to deploy
└── img/
    └── loreal-logo.png
```

## Setup

### 1. Get an OpenAI API key

Sign in to [platform.openai.com](https://platform.openai.com), go to **API Keys**, and create a new key. Paste it into `secrets.js`:

```js
const OPENAI_API_KEY = "sk-...";
```

### 2. Deploy the Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Start with Hello World**
2. Name your worker (e.g. `loreal-chatbot`) and click **Deploy**
3. Click **Edit code**, replace the default code with the contents of `RESOURCE_cloudflare-worker.js`, and deploy again
4. Go to **Settings → Variables and Secrets**, add a secret named `OPENAI_API_KEY` with your key

### 3. Update the Worker URL

In `script.js`, replace the placeholder with your Worker's URL:

```js
const CLOUDFLARE_WORKER_URL = "https://loreal-chatbot.YOUR-SUBDOMAIN.workers.dev/";
```

### 4. Open the app

Open `index.html` in a browser (or via Live Server / GitHub Codespaces preview).

## How it works

```
Browser → Cloudflare Worker → OpenAI API
```

The Cloudflare Worker acts as a secure proxy server. The browser never sees the API key — the Worker reads it from Cloudflare's secret storage and attaches it server-side before forwarding the request to OpenAI.

## Try the Chatbot!

[Loreal Beauty Advisor](https://quynhtruong1303.github.io/loreal-chatbot/)
