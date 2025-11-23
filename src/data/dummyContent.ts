// src/data/dummyContent.ts

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show"; // Added 'music_show' type
  full_content?: string;
  link: string;
  video_url?: string; // New field for video content
  image_gallery_urls?: string[]; // New field for image galleries
  music_embed_url?: string; // New field for music embeds (Spotify, Apple Music, YouTube)
  creator_id?: string; // New field for creator's user ID
  creator_name?: string; // New field for creator's name
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork_url: string;
  embed_url: string; // Direct embed URL for the track
}

interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  embed_url: string; // Direct embed URL for the playlist
  genre: string;
  tracks?: MusicTrack[]; // Optional list of tracks
}

const generateDummyContent = (type: "show" | "video" | "article" | "event" | "sponsored" | "music_show", count: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const linkPrefix = {
    show: '/shows',
    video: '/watch',
    article: '/news',
    event: '/events',
    sponsored: '/sponsored',
    music_show: '/music/shows', // New link prefix for music shows
  }[type];

  for (let i = 1; i <= count; i++) {
    const id = `${type}-${i}`;
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Title ${i}`;
    const description = `This is a dummy description for ${type} item number ${i}. It provides a brief overview of the content to fill the space.`;
    const imageUrl = `https://via.placeholder.com/400x250/1a202c/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+${i}`;
    const category = ["Music", "Tech", "Fashion", "Sports", "Culture", "Nature", "News", "Entertainment", "Documentary"][Math.floor(Math.random() * 9)];
    const linkSlug = `${type}-slug-${i}`;
    const fullContent = `<h2>Full Content for ${title}</h2><p>This is the detailed content for ${type} item ${i}. It includes more extensive text to simulate a full article or show description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
    const creatorId = `creator-${(i % 3) + 1}`; // Assign dummy creator IDs
    const creatorName = `Creator ${(i % 3) + 1}`; // Assign dummy creator names

    const item: ContentItem = {
      id,
      title,
      description,
      image_url: imageUrl,
      category,
      link_slug: linkSlug,
      type,
      full_content: fullContent,
      link: `${linkPrefix}/${linkSlug}`,
      creator_id: creatorId,
      creator_name: creatorName,
    };

    if (type === "video") {
      item.video_url = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1`; // Rick Astley for fun
    } else if (type === "article" || type === "show" || type === "sponsored" || type === "music_show") {
      item.image_gallery_urls = [
        `https://via.placeholder.com/800x450/2d3748/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+Gallery+1`,
        `https://via.placeholder.com/800x450/4a5568/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+Gallery+2`,
        `https://via.placeholder.com/800x450/718096/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+Gallery+3`,
      ];
    }
    if (type === "music_show") {
      item.music_embed_url = `https://open.spotify.com/embed/episode/7mF0222222222222222222?utm_source=generator`; // Example Spotify podcast embed
    }

    items.push(item);
  }
  return items;
};

export const dummyShows = generateDummyContent("show", 6);
export const dummyVideos = generateDummyContent("video", 6);
export const dummyArticles = generateDummyContent("article", 6);
export const dummyEvents = generateDummyContent("event", 6);
export const dummySponsoredContent = generateDummyContent("sponsored", 3);
export const dummyMusicShows = generateDummyContent("music_show", 6); // New dummy music shows

// Dummy Music Playlists
export const dummyMusicPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    title: "Afrobeat Essentials",
    description: "The best of Afrobeat, from classics to new hits.",
    cover_url: "https://via.placeholder.com/300x300/C1272D/FFFFFF?text=Afrobeat",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmFgLh?utm_source=generator",
    genre: "Afrobeat",
  },
  {
    id: "playlist-2",
    title: "South African House Grooves",
    description: "Deep and soulful house music from South Africa.",
    cover_url: "https://via.placeholder.com/300x300/1F1F1F/FFFFFF?text=SA+House",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator",
    genre: "House",
  },
  {
    id: "playlist-3",
    title: "Naija Pop Hits",
    description: "Catchy tunes and chart-toppers from Nigeria.",
    cover_url: "https://via.placeholder.com/300x300/9CA3AF/FFFFFF?text=Naija+Pop",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2S9rTfJ6z5A?utm_source=generator",
    genre: "Pop",
  },
  {
    id: "playlist-4",
    title: "African Jazz Legends",
    description: "A journey through the timeless sounds of African jazz.",
    cover_url: "https://via.placeholder.com/300x300/000000/FFFFFF?text=African+Jazz",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXbIe2gUu2z0S?utm_source=generator",
    genre: "Jazz",
  },
];

// Dummy New Music Releases/Artists
export const dummyNewReleases: MusicTrack[] = [
  {
    id: "track-1",
    title: "New Dawn",
    artist: "Artist X",
    album: "Awakening",
    artwork_url: "https://via.placeholder.com/300x300/C1272D/FFFFFF?text=New+Dawn",
    embed_url: "https://open.spotify.com/embed/track/5mF0222222222222222222?utm_source=generator",
  },
  {
    id: "track-2",
    title: "City Lights",
    artist: "Artist Y",
    album: "Urban Rhythms",
    artwork_url: "https://via.placeholder.com/300x300/1F1F1F/FFFFFF?text=City+Lights",
    embed_url: "https://open.spotify.com/embed/track/7mF0222222222222222222?utm_source=generator",
  },
  {
    id: "track-3",
    title: "Desert Bloom",
    artist: "Artist Z",
    album: "Oasis",
    artwork_url: "https://via.placeholder.com/300x300/9CA3AF/FFFFFF?text=Desert+Bloom",
    embed_url: "https://open.spotify.com/embed/track/1mF0222222222222222222?utm_source=generator",
  },
];


// For search results and category pages, we can combine and extend
export const allDummyContent: ContentItem[] = [
  ...generateDummyContent("show", 10),
  ...generateDummyContent("video", 10),
  ...generateDummyContent("article", 10),
  ...generateDummyContent("event", 10),
  ...generateDummyContent("sponsored", 5),
  ...generateDummyContent("music_show", 5), // Include music shows in allDummyContent
];

// Dummy ticker messages
export const dummyTickerMessages = [
  "Breaking News: African Tech Summit Kicks Off!",
  "Live Score: Senegal vs. Egypt - Halftime Update!",
  "New Music Release: Afrobeat sensation drops new album!",
  "Fashion Week Highlights: Latest trends from Lagos!",
  "Upcoming Event: Cultural Festival in Accra next month!",
];