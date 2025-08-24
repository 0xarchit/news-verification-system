import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const corsMiddleware = cors();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Initialize Gemini API
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not defined in environment variables');
  throw new Error('Missing API key');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fetchNewsFromAPI(text, category) {
  if (!process.env.NEWSAPIURL) {
    console.error('Error: NEWSAPIURL is not defined in environment variables');
    return [];
  }
  
  try {
    const response = await fetch(process.env.NEWSAPIURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ news_text: text, category }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch news from API:", error);
    return [];
  }
}

app.post('/verify-news', async (req, res) => {
  const { text, category } = req.body;

  if (!text || !category) {
    return res.status(400).json({
      error: "News text and category are required"
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const newsItems = await fetchNewsFromAPI(text, category);

    const newsContext = newsItems
      .map(item => 
        `Headline: ${item.headline}\nDescription: ${item.description}\nSource: ${item.source_link}\nDate: ${item.date}`
      )
      .join("\n\n");

    const sources = newsItems.map(item => item.source_link).filter(Boolean);
    const sourcesText = sources.length > 0
      ? `Verified against sources: ${sources.join(", ")}. `
      : "No specific sources available from the news data. ";

    const prompt = `You are a news verification system analyzing user-submitted news against provided recent news data. 
    First translate the News Content to English if needed. 
    Then verify the News Content against the provided news context and the specified category.
    If the news content doesn't match the given category, note that the user-given category doesn't match then say invalid category selected.
    Analyze credibility based on matches with the news context, source reliability, and content consistency.
    Include the list of sources from the news context in the "sourceandrelated" field, starting with "${sourcesText}".
    Respond with ONLY a JSON object in this exact format:

    News Category: ${category}
    News Content: ${text}
    Recent News Context: 
    ${newsContext || "No recent news data available"}

    {
      "trustScore": (number 0-100),
      "analysis": (string, 1-2 sentences),
      "sourceandrelated": (string, 2-4 sentences starting with "${sourcesText}"),
      "potentialBiases": (array of 1-3 strings),
      "recommendation": (string)
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim()
      .replace(/^```json\n|\n```$/g, "");

    const parsedResponse = JSON.parse(responseText);
    
    if (
      typeof parsedResponse.trustScore !== "number" ||
      typeof parsedResponse.analysis !== "string" ||
      typeof parsedResponse.sourceandrelated !== "string" ||
      !Array.isArray(parsedResponse.potentialBiases) ||
      typeof parsedResponse.recommendation !== "string" ||
      parsedResponse.trustScore < 0 ||
      parsedResponse.trustScore > 100
    ) {
      throw new Error("Invalid response structure");
    }

    res.status(200).json(parsedResponse);
  } catch (error) {
    res.status(500).json({
      error: `Failed to verify news: ${error.message}`
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});