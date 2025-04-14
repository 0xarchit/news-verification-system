# Fake News Detector

![Fake News Detector](public/image.png)

A progressive web application that uses AI to verify the authenticity of news articles instantly.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Backend Status](#backend-status)
- [API Integration](#api-integration)
- [PWA Features](#pwa-features)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

Fake News Detector is a tool designed to help users verify the authenticity of news articles using AI-powered analysis. It provides trust scores, source verification, bias detection, and recommendations for each article analyzed.

## Features

- 🔍 **Text & URL Analysis**: Analyze news content directly or from a URL
- 📊 **Trust Scoring**: Get a numerical score representing the credibility of the article
- 🔗 **Source Verification**: Cross-reference with trusted sources
- ⚖️ **Bias Detection**: Identify potential biases in the content
- 📱 **Progressive Web App**: Install on any device for offline access
- 🎨 **Modern UI**: Responsive design with smooth animations

## Live Demo

Try the application live at: [news-verification-system.pages.dev](https://news-verification-system.pages.dev) or [fake-news.0xarchit.is-a.dev](https://fake-news.0xarchit.is-a.dev)

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - React Router for navigation
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Vite for build tooling

- **Backend**:
  - Express.js
  - Google Generative AI (Gemini API)
  - Hosted on a dedicated server

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/0xarchit/fake-news-detector.git
   cd fake-news-detector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Gemini API key:
   ```
   VITE_GEMINIAPIURL=https://gemini.0xarchit.is-a.dev/analyse
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. Visit the application in your browser
2. Choose between analyzing text or a URL
3. Enter the news content or URL you want to verify
4. Select the appropriate category for the news
5. Click "Verify News" to get the analysis results
6. Review the trust score, analysis, sources, and recommendations

## Backend Status

The backend service is hosted separately and can occasionally go offline for maintenance or resource conservation. You can check the current status of the backend API at:

[Backend Status Check](https://backend.0xarchit.is-a.dev/)

If the backend is offline, the application will display an appropriate error message when trying to verify news. Please try again later if this occurs.

## API Integration

The application uses the Gemini API for news verification. The API endpoint configuration is handled automatically based on the domain you're accessing the application from.

For developers who want to use the API directly:

```typescript
// API Request Format
const response = await fetch("https://gemini.0xarchit.is-a.dev/analyse", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "Your news text or URL here",
    category: "politics", // One of: education, finance, politics, world, india, tech, entertainment, sports, science
  }),
});

const result = await response.json();
```

## PWA Features

This application is a Progressive Web App (PWA) that can be installed on your device:

- Works offline with cached assets
- Install prompt on supported browsers
- Full-screen mode when launched from home screen
- Fast loading with service worker caching

## Development

### Project Structure
