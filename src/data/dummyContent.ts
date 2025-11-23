// src/data/dummyContent.ts

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  full_content?: string;
  link: string;
  video_url?: string; // New property for video content
}

const generateDummyContent = (type: "show" | "video" | "article" | "event", count: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const linkPrefix = {
    show: '/shows',
    video: '/watch',
    article: '/news',
    event: '/events',
  }[type];

  for (let i = 1; i <= count; i++) {
    const id = `${type}-${i}`;
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Title ${i}`;
    const description = `This is a dummy description for ${type} item number ${i}. It provides a brief overview of the content to fill the space.`;
    const imageUrl = `https://via.placeholder.com/400x250/1a202c/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+${i}`;
    const category = ["Music", "Tech", "Fashion", "Sports", "Culture", "Nature"][Math.floor(Math.random() * 6)];
    const linkSlug = `${type}-slug-${i}`;
    
    let fullContent = `<h2>Full Content for ${title}</h2><p>This is the detailed content for ${type} item ${i}. It includes more extensive text to simulate a full article or show description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
    let videoUrl: string | undefined = undefined;

    if (type === "show" || type === "video") {
      videoUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1`; // Placeholder YouTube video
      fullContent = `<p>Enjoy this captivating ${type}!</p>` + fullContent;
    } else if (type === "article") {
      fullContent = `<h3>Introduction to ${title}</h3><p>This article delves deep into the fascinating world of ${category}. We explore its origins, impact, and future trends. The African continent is a hub of innovation and creativity, and this piece aims to highlight some of its most compelling aspects.</p><h4>Key Takeaways:</h4><ul><li>Understanding the cultural significance.</li><li>Exploring technological advancements.</li><li>Impact on global trends.</li></ul><p>Stay tuned for more in-depth analysis and exclusive interviews!</p>` + fullContent;
    }

    items.push({
      id,
      title,
      description,
      image_url: imageUrl,
      category,
      link_slug: linkSlug,
      type,
      full_content: fullContent,
      link: `${linkPrefix}/${linkSlug}`,
      video_url: videoUrl,
    });
  }
  return items;
};

export const dummyShows = generateDummyContent("show", 6);
export const dummyVideos = generateDummyContent("video", 6);
export const dummyArticles = generateDummyContent("article", 6);
export const dummyEvents = generateDummyContent("event", 6);

// For search results and category pages, we can combine and extend
export const allDummyContent: ContentItem[] = [
  ...generateDummyContent("show", 10),
  ...generateDummyContent("video", 10),
  ...generateDummyContent("article", 10),
  ...generateDummyContent("event", 10),
];

// Dummy ticker messages
export const dummyTickerMessages = [
  "Breaking News: African Tech Summit Kicks Off!",
  "Live Score: Senegal vs. Egypt - Halftime Update!",
  "New Music Release: Afrobeat sensation drops new album!",
  "Fashion Week Highlights: Latest trends from Lagos!",
  "Upcoming Event: Cultural Festival in Accra next month!",
];