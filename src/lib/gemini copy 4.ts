// gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const EXPRESS_API_URL = 'http://localhost:8000/api/analyze';

export async function verifyNews(text: string, category: string) {
  if (!text || !category) {
    throw new Error('News text and category are required');
  }

  try {
    // Step 1: Fetch real-time news from Express.js API
    const apiResponse = await axios.post(EXPRESS_API_URL, {
      news_text: text,
      category: category
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fetchedNews = apiResponse.data.results || [];
    const newsSummary = fetchedNews.map((item: any) => ({
      headline: item.headline,
      description: item.description,
      source_link: item.source_link,
      date: item.date
    }));

    // Step 2: Use Gemini to analyze the news with updated prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a news verification system that relies on pre-fetched real-time news data provided to you. You do not have direct internet access. Your task is to compare the user-submitted news content with the fetched news data provided below, which was retrieved from DuckDuckGo via an external API. First, translate the user-submitted News Content to English if it’s not already in English (assume it’s English unless it’s obviously not). Then, analyze the user-submitted news against the fetched news within the given category. If the user-submitted news does not align with the provided category based on the fetched data, state that "the user-given category does not match" and determine the appropriate category based on the content, justifying your choice. Use the following primary sources as a reference for credibility when they appear in the fetched news, and assess trustworthiness accordingly:

Primary Sources for Verification:
- Politics: The Times of India, NDTV, India Today, CNBC
- Finance: Economic Times, Business Standard, Moneycontrol
- Technology: TechCrunch, Gizmodo, The Verge
- Health: WebMD, Healthline, Medical News Today
- Entertainment: Bollywood Hungama, Hollywood Reporter, Variety
- Sports: ESPN, SportsCricbuzz, Sportskeeda
- Science: Scientific American, Nature, Science Daily
- India: The Hindu, Indian Express, Hindustan Times
- International: BBC News, Reuters, Al Jazeera, CNBC

User-submitted News Category: ${category}
User-submitted News Content: ${text}
Fetched News Data from DuckDuckGo (JSON): ${JSON.stringify(newsSummary, null, 2)}

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "trustScore": (number 0-100),
  "analysis": (string, 1-2 sentences),
  "sourceandrelated": (string, 2-4 sentences),
  "potentialBiases": (array of 1-3 strings),
  "recommendation": (string)
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Remove markdown code blocks if present
    responseText = responseText.replace(/^```json\n|\n```$/g, '');

    try {
      const parsedResponse = JSON.parse(responseText);

      // Validate response format
      if (
        typeof parsedResponse.trustScore !== 'number' ||
        typeof parsedResponse.analysis !== 'string' ||
        !Array.isArray(parsedResponse.potentialBiases) ||
        typeof parsedResponse.recommendation !== 'string' ||
        parsedResponse.trustScore < 0 ||
        parsedResponse.trustScore > 100
      ) {
        throw new Error('Invalid response structure');
      }

      return parsedResponse;
    } catch (parseError) {
      throw new Error('Problem in input. Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to verify news: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while verifying the news');
  }
}