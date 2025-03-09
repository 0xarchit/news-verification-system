import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

interface VerificationResult {
  trustScore: number;
  analysis: string;
  sourceandrelated: string;
  potentialBiases: string[];
  recommendation: string;
}

const DEFAULT_VERIFICATION_RESULT: VerificationResult = {
  trustScore: 50,
  analysis: "Unable to fully verify the news content.",
  sourceandrelated: "No related sources found.",
  potentialBiases: ["Verification process encountered limitations"],
  recommendation: "Exercise caution and seek additional sources."
};

async function fetchNewsFromAPI(query: string): Promise<any[]> {
  try {
    const apiKey = import.meta.env.VITE_NEWSAPI_API_KEY;
    if (!apiKey) throw new Error('NewsAPI key is missing');

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7); // Fetch news from last 7 days
    const formattedFromDate = fromDate.toISOString().split('T')[0];

    console.log('Fetching news with query:', query);

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey,
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        from: formattedFromDate,
        pageSize: 5
      },
      timeout: 10000
    });

    console.log('NewsAPI Response:', JSON.stringify(response.data, null, 2));

    if (!response.data.articles || response.data.articles.length === 0) {
      console.warn('No relevant articles found for query:', query);
      return [];
    }

    return response.data.articles;
  } catch (error: any) {
    console.error('News API Fetch Error:', error.message, error.response?.data);
    return [];
  }
}

export async function verifyNews(text: string): Promise<VerificationResult> {
  try {
    const relatedNews = await fetchNewsFromAPI(text);
    const hasRelevantNews = relatedNews.length > 0;
    const newsContext = hasRelevantNews
      ? relatedNews.map(article => `Source: ${article.source.name}\nTitle: ${article.title}\nDescription: ${article.description}\nDate: ${article.publishedAt}`).join('\n\n')
      : 'No relevant news found. AI must not rely on internal knowledge.';

    console.log('Generated News Context:', newsContext);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Verify this news content:

News Content: ${text}

Related News Context:
${newsContext}

Rules:
1. If real-time news is available, ONLY rely on it.
2. If no news is found, state that verification is not possible.

Provide a response in strict JSON format:
{
  "trustScore": (integer between 0-100),
  "analysis": "(string summary)",
  "sourceandrelated": "(string source context)",
  "potentialBiases": ["(string)", "(string)"],
  "recommendation": "(string advice)"
}`;

    console.log('Generated Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log('Raw AI Response:', responseText);

    const cleanResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResponse: VerificationResult;
    try {
      parsedResponse = JSON.parse(cleanResponse);

      if (
        typeof parsedResponse.trustScore !== 'number' ||
        isNaN(parsedResponse.trustScore) ||
        parsedResponse.trustScore < 0 ||
        parsedResponse.trustScore > 100
      ) {
        throw new Error('Invalid trust score format');
      }

      if (!Array.isArray(parsedResponse.potentialBiases)) {
        parsedResponse.potentialBiases = [String(parsedResponse.potentialBiases)];
      }
      
      console.log('Parsed Verification Result:', parsedResponse);
      return parsedResponse;
    } catch (parseError) {
      console.error('Response Parsing Error:', parseError, 'Raw Response:', cleanResponse);
      return DEFAULT_VERIFICATION_RESULT;
    }
  } catch (error) {
    console.error('Verification Process Error:', error);
    return DEFAULT_VERIFICATION_RESULT;
  }
}

export function safeVerifyNews(text: string) {
  return verifyNews(text).catch(error => {
    console.error('Unhandled Verification Error:', error);
    return DEFAULT_VERIFICATION_RESULT;
  });
}