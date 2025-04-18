import type { FeedOptions } from "@nuxtjs/feed";

const baseUrl = process.env.NODE_ENV === "production"
  ? "https://oguzaltnby.com"
  : "http://localhost:3000";

const baseUrlArticles = `${baseUrl}/blog`;

const feedFormats = {
  rss: { type: "rss2", file: "rss.xml" },
  json: { type: "json1", file: "feed.json" },
};

const createFeedArticles = async (feed: any) => {
  const { $content } = require("@nuxt/content");

  feed.options = {
    title: "Oguzhan's Blog",
    link: baseUrlArticles,
    description: "Oguzhan'ın blog yazıları",
  };

  const articles = await $content("blog").sortBy("createdAt", "desc").fetch();

  articles.forEach((article: any) => {
    const url = `${baseUrlArticles}/${article.slug}`;
    const postImage = article.image
      ? `${baseUrl}${article.image}`
      : `${baseUrl}/assets/images/posts/${article.slug}.jpg`;

    feed.addItem({
      title: article.title,
      link: url,
      description: article.description,
      content: article.summary,
      date: new Date(article.createdAt),
      customElements: [{ image: postImage }],
    });
  });
};

const Feed: FeedOptions[] = Object.values(feedFormats).map(({ file, type }) => ({
  path: file,
  type,
  create: createFeedArticles,
}));

export default Feed;
