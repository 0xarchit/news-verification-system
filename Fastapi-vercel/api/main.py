from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiohttp
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from typing import List, Dict
import asyncio
import urllib.parse

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://gemini-server-xi.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CATEGORIES = [
    "education", "finance", "politics", "world",
    "india", "tech", "entertainment", "sports", "science"
]

class NewsInput(BaseModel):
    news_text: str
    category: str

async def extract_date(soup: BeautifulSoup) -> str:
    """Fast date extraction"""
    date_tag = soup.find('meta', {'property': 'article:published_time'}) or \
               soup.find('time')
    if date_tag:
        date_str = date_tag.get('content') or date_tag.get('datetime') or ''
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00')).strftime('%Y-%m-%d')
        except:
            pass
    return datetime.now().strftime('%Y-%m-%d')

async def decode_duckduckgo_url(ddg_url: str) -> str:
    """Decode DuckDuckGo URL"""
    if 'uddg=' in ddg_url:
        try:
            return urllib.parse.unquote(ddg_url.split('uddg=')[1].split('&')[0])
        except:
            return ddg_url
    return ddg_url

async def duckduckgo_search(query: str) -> List[str]:
    """Reliable DuckDuckGo search"""
    async with aiohttp.ClientSession() as session:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        url = f"https://duckduckgo.com/html/?q={query}"
        try:
            logger.debug(f"Searching DuckDuckGo with query: {query}")
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=5)) as response:
                text = await response.text()
                soup = BeautifulSoup(text, 'lxml')
                links = [a.get('href') for a in soup.select('a.result__url')[:6] if a.get('href')]
                decoded_links = [await decode_duckduckgo_url(link) for link in links]
                valid_links = [link for link in decoded_links if link.startswith('http')]
                logger.debug(f"Found {len(valid_links)} valid links: {valid_links}")
                return valid_links
        except Exception as e:
            logger.error(f"Search failed: {str(e)}")
            return []

async def fetch_url(session: aiohttp.ClientSession, url: str) -> Dict:
    """Robust URL fetch"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        logger.debug(f"Fetching URL: {url}")
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=5)) as response:
            if response.status != 200:
                logger.debug(f"URL {url} returned status {response.status}")
                return None
            text = await response.text(errors='ignore')
            soup = BeautifulSoup(text, 'lxml', from_encoding='utf-8')
            
            headline = soup.title.get_text(strip=True) if soup.title else url
            headline = headline[:150] if headline else url
            
            desc_tag = soup.find('meta', {'name': 'description'}) or \
                      soup.find('meta', {'property': 'og:description'})
            description = desc_tag.get('content', '').strip()[:200] if desc_tag else ''
            if not description:
                p = soup.find('p')
                description = p.get_text(strip=True)[:200] if p else "No description available"
            
            date = await extract_date(soup)
            
            result = {
                "headline": headline,
                "description": description,
                "source_link": url,
                "date": date
            }
            logger.debug(f"Successfully fetched: {url}")
            return result
    except Exception as e:
        logger.debug(f"Fetch failed for {url}: {str(e)}")
        return None

async def get_news_results(news_text: str, category: str) -> List[Dict]:
    """Improved news processing"""
    if category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    query = f"{news_text} {category} news -inurl:(.in, .com, .org, .net, .gov, .edu, .uk, .au, .ca, .us, .co, .co.in)"
    search_results = await duckduckgo_search(query)
    
    if not search_results:
        logger.warning("No search results found")
        return []
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in search_results[:4]]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
    valid_results = [r for r in results if r and not isinstance(r, Exception)]
    if valid_results:
        valid_results.sort(key=lambda x: x['date'], reverse=True)
        logger.info(f"Returning {len(valid_results)} results")
    else:
        logger.warning("No valid results after fetching")
    return valid_results[:5]

@app.post("/api/analyze", response_class=JSONResponse)
async def analyze_news(news_input: NewsInput):
    """API endpoint with debugging"""
    try:
        results = await get_news_results(news_input.news_text, news_input.category)
        if not results:
            logger.warning(f"No results for query: {news_input.news_text}, category: {news_input.category}")
        return JSONResponse(content={"results": results})
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        return JSONResponse(content={"error": "Internal server error"}, status_code=500)
    
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"status": "ok"}


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=10000)