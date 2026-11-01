function fetchRSS() {
  const rssUrl = "https://news.google.com/rss/search?q=(OpenAI+OR+Gemini+OR+Anthropic+OR+NVIDIA+OR+Microsoft+AI+OR+Meta+AI+OR+Artificial+Intelligence)&hl=en-IN&gl=IN&ceid=IN:en";
  
  const response = UrlFetchApp.fetch(rssUrl);

  const document = XmlService.parse(response.getContentText());

  const channel = document.getRootElement().getChild("channel");

  const items = channel.getChildren("item");

  const articles = [];

  for (let i = 0; i < Math.min(items.length, 5); i++) {

    const title = items[i].getChildText("title");
    const link = items[i].getChildText("link");
    const description = items[i].getChildText("description");
    const pubDate = items[i].getChildText("pubDate");

    const parts = title.split(" - ");
    const source = parts.length > 1 ? parts.pop() : "Unknown";
    const cleanTitle = parts.join(" - ");

    articles.push({
      title: cleanTitle,
      source: source,
      link: link,
      description: description,
      date: pubDate
    });
  }

  return articles;
}