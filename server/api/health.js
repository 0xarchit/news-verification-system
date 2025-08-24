// api/health.js
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }

  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      geminiApiKeySet: !!process.env.GEMINI_API_KEY,
      newsApiUrlSet: !!process.env.NEWSAPIURL
    }
  };

  res.status(200).json(healthStatus);
}