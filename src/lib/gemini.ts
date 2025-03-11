import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function fetchNewsFromAPI(text: string, category: string) {
  try {
    const response = await fetch(import.meta.env.VITE_NEWSAPIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        news_text: text,
        category: category,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch news from API:', error);
    return [];
  }
}

export async function verifyNews(text: string, category: string) {
  if (!text || !category) {
    throw new Error('News text and category are required');
  }

  // Create a unique cache key based on text and category
  const cacheKey = `newsVerification:${text}:${category}`;
  
  // Check session storage for cached result
  const cachedResult = sessionStorage.getItem(cacheKey);
  if (cachedResult) {
    try {
      const parsedCachedResult = JSON.parse(cachedResult);
      console.log('Returning cached result for:', cacheKey);
      return parsedCachedResult;
    } catch (error) {
      console.error('Failed to parse cached result:', error);
      // Proceed to fetch fresh result if cache is corrupted
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const newsItems = await fetchNewsFromAPI(text, category);

    // Prepare news context from API
    const newsContext = newsItems.map(item => 
      `Headline: ${item.headline}\nDescription: ${item.description}\nSource: ${item.source_link}\nDate: ${item.date}`
    ).join('\n\n');

    // Extract sources for inclusion in sourceandrelated
    const sources = newsItems.map(item => item.source_link).filter(Boolean);
    const sourcesText = sources.length > 0 
      ? `Verified against sources: ${sources.join(', ')}. `
      : 'No specific sources available from the news data. ';

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
    ${newsContext || 'No recent news data available'}

    {
      "trustScore": (number 0-100),
      "analysis": (string, 1-2 sentences),
      "sourceandrelated": (string, 2-4 sentences starting with "${sourcesText}"),
      "potentialBiases": (array of 1-3 strings),
      "recommendation": (string)
    }
      
    if newscontext is null then:
    {
      "trustScore": 0,
      "analysis": "No recent news data available or selected category is invalid",
      "sourceandrelated": "",
      "potentialBiases": [],
      "recommendation": ""
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
        typeof parsedResponse.sourceandrelated !== 'string' || 
        !Array.isArray(parsedResponse.potentialBiases) || 
        typeof parsedResponse.recommendation !== 'string' ||
        parsedResponse.trustScore < 0 ||
        parsedResponse.trustScore > 100
      ) {
        throw new Error('Invalid response structure');
      }
      
      // Cache the result in session storage
      sessionStorage.setItem(cacheKey, JSON.stringify(parsedResponse));
      console.log('Cached result for:', cacheKey);

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