import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function verifyNews(text: string, category: string) {
  if (!text || !category) {
    throw new Error('News text and category are required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `You are a news verification system which can access realtime news from internet. First translate News Content to English with Google Translate. Then Check it with latest news from internet from given category and sources and verified sources. Analyze this news and respond with a JSON object.
    If given news content is not belong to given category then say user given category not match so analysis are based on ai and then give result mentioning on top that user category not match hence category decided by ai. Also justify the score you give.
    for primary level verification use these:

Category: Source
Politics:The Times of India, NDTV, India Today, CNBC
Finance:Economic Times, Business Standard, Moneycontrol
Technology: TechCrunch, Gizmodo, The Verge
Health: WebMD, Healthline, Medical News Today
Entertainment: Bollywood Hungama, Hollywood Reporter, Variety
Sports: ESPN, SportsCricbuzz, Sportskeeda
Science: Scientific American, Nature, Science Daily
India: The Hindu, Indian Express, Hindustan Times
International: BBC News, Reuters, Al Jazeera, CNBC

News Category: ${category}
News Content: ${text}

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "trustScore": (number 0-100),
  "analysis": (string, 1-2 sentences),
  "sourceandrelated": (string, 2-4 sentences),
  "potentialBiases": (array of 1-3 strings),
  "recommendation": (string)
}`;

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
      throw new Error('Probelem in input. Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to verify news: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while verifying the news');
  }
}
