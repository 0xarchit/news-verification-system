export async function verifyNews(source: string, category: string) {
  // Try to get the URL from environment variables, falling back to localhost
  let apiUrl = import.meta.env.VITE_GEMINIAPIURL;

  // Check for domain to determine if we should use tunnel URL
  const isTunnelHost = window.location.hostname.includes("0xarchit.is-a.dev");

  // If we're accessing via tunnel domain and no specific API URL is set,
  // use the gemini tunnel URL
  if (isTunnelHost && !apiUrl.includes("0xarchit.is-a.dev")) {
    apiUrl = "https://gemini.0xarchit.is-a.dev/analyse";
    console.log("Using tunnel URL for API:", apiUrl);
  }

  if (!apiUrl || apiUrl === "undefined") {
    console.error("Error: VITE_GEMINIAPIURL is not defined or invalid.");
    throw new Error(
      "API URL is not defined. Please check your environment variables."
    );
  }

  // Use simple fetch without extra headers that might break things
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: source,
      category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to verify news: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
