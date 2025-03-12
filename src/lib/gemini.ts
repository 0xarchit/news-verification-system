export async function verifyNews(source: string, category: string) {
  const apiUrl = import.meta.env.VITE_GEMINIAPIURL;

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
