import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WebSearchResponse {
  source: string;
  query: string;
  results: SearchResult[];
}

export async function webSearch({ query }: { query: string }): Promise<WebSearchResponse> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error("Missing SERPAPI_KEY in environment variables");
  }

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    return {
      source: "serpapi",
      query,
      results: data.organic_results?.map((r: any) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet
      })) ?? []
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`SerpAPI error: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}
