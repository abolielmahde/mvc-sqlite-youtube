function buildSearchUrl(query, maxResults = 9) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("safeSearch", "strict");
  return url;
}

class YouTubeService {
  async searchVideos(query) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      const err = new Error("Missing YOUTUBE_API_KEY environment variable.");
      err.status = 500;
      throw err;
    }

    const url = buildSearchUrl(query);
    url.searchParams.set("key", apiKey);

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const err = new Error(`YouTube API error: ${resp.status} ${text}`);
      err.status = 502;
      throw err;
    }

    const data = await resp.json();
    const items = Array.isArray(data.items) ? data.items : [];

    return items
      .filter((it) => it && it.id && it.id.videoId && it.snippet)
      .map((it) => ({
        videoId: it.id.videoId,
        title: it.snippet.title || "Untitled",
        channelTitle: it.snippet.channelTitle || "",
        thumbnailUrl:
          (it.snippet.thumbnails &&
            (it.snippet.thumbnails.medium || it.snippet.thumbnails.default || it.snippet.thumbnails.high) &&
            (it.snippet.thumbnails.medium?.url ||
              it.snippet.thumbnails.high?.url ||
              it.snippet.thumbnails.default?.url)) ||
          "",
      }));
  }
}

module.exports = { YouTubeService };
