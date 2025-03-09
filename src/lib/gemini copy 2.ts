import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

// Define Configs
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
};

// Define Types
interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface AIResponse {
  trustScore: number;
  analysis: string;
  sourceandrelated: string;
  potentialBiases: string[];
  recommendation: string;
}

const VALID_CATEGORIES = ["top", "business", "technology", "sports", "entertainment", "health", "science", "world", "politics"];

// **Fetch News from NewsData.io**
async function fetchRelevantNews(userQuery: string, category: string): Promise<NewsArticle[]> {
  category = category.toLowerCase().trim();
  if (!VALID_CATEGORIES.includes(category)) {
    console.warn(`⚠️ Invalid category: ${category}. Defaulting to 'top'.`);
    category = "top";
  }

  const cacheKey = `news_cache_${userQuery}_${category}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    console.log("📌 Using Cached News Data");
    return JSON.parse(cachedData);
  }

  if (!API_KEY) throw new Error("NewsData.io API Key is missing.");

  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(userQuery)}&language=en&category=${category}`;

  try {
    console.log("🔍 Fetching latest news...", { query: userQuery, category, url });
    const response = await fetch(url, { mode: "cors" });
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      throw new Error(`News API failed: ${data.results?.message || response.status}`);
    }

    console.log("📰 News API Response:", data);

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn(`⚠️ No news articles found for '${userQuery}' in category '${category}'.`);
      return [];
    }

    const articles = data.results.slice(0, 5).map((article: any) => ({
      title: article.title || "Unknown Title",
      source: article.source_id || "Unknown Source",
      url: article.link || "#",
      publishedAt: article.pubDate || "Unknown Date",
    }));

    localStorage.setItem(cacheKey, JSON.stringify(articles));
    return articles;
  } catch (error) {
    console.error("❌ Failed to fetch news:", error);
    return [];
  }
}

// **Verify News Using Gemini AI**
export async function verifyNews(text: string, category: string): Promise<AIResponse> {
  if (!text.trim() || !category.trim()) {
    throw new Error("News text and category are required.");
  }

  try {
    const relevantNews = await fetchRelevantNews(text, category);
    let newsData = "⚠️ No matching live news found. AI will analyze using general knowledge.";

    if (relevantNews.length > 0) {
      newsData = relevantNews
        .map(
          (news) =>
            `- **Title:** ${news.title}\n  **Source:** ${news.source}\n  **Published At:** ${news.publishedAt}\n  **Link:** ${news.url}`
        )
        .join("\n\n");
    }

    console.log("📝 Sending request to Gemini AI...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chatSession = model.startChat({ generationConfig, history: [] });

    const prompt = `You are a real-time news verification AI. Your task is to compare the given user news with real-time verified news sources.

    **User News Category:** ${category}
    **User News Content:** ${text}

    ${newsData}

    **Instructions:**
    - Compare the given news with the latest relevant news sources.
    - If there is a match, provide a trust score (0-100).
    - If no match is found, state that the news could not be verified.
    - Cross-check multiple sources for reliability.
    - Avoid generating outdated or unrelated information.
    - Respond ONLY in JSON format.

    **Response Format:**
    {
      "trustScore": (number 0-100),
      "analysis": (string, 1-2 sentences),
      "sourceandrelated": (string, 2-4 sentences),
      "potentialBiases": (array of 1-3 strings),
      "recommendation": (string)
    }`;

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text().trim().replace(/^```json\n|\n```$/g, "");

    try {
      const parsedResponse: AIResponse = JSON.parse(responseText);
      if (
        typeof parsedResponse.trustScore !== "number" ||
        typeof parsedResponse.analysis !== "string" ||
        !Array.isArray(parsedResponse.potentialBiases) ||
        typeof parsedResponse.recommendation !== "string" ||
        parsedResponse.trustScore < 0 ||
        parsedResponse.trustScore > 100
      ) {
        throw new Error("Invalid AI response structure.");
      }

      console.log("✅ AI response generated successfully!");
      return parsedResponse;
    } catch (parseError) {
      console.error("❌ AI response could not be parsed:", responseText);
      throw new Error("Failed to parse AI response. Try again.");
    }
  } catch (error) {
    console.error("❌ Verification failed:", error);
    throw new Error(`Failed to verify news: ${(error as Error).message}`);
  }
}