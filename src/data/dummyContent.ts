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

// Interface for Innovator Spotlight data (matching src/lib/misc.ts)
interface InnovatorProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
}

interface InnovatorSpotlight {
  id: string;
  tagline: string;
  profile_id: string;
  profiles: InnovatorProfile;
  spotlight_content_id?: string | null;
  content?: ContentItem | null;
}

// Interface for Masterclass (matching src/lib/masterclasses.ts)
interface Masterclass {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  instructor_id: string;
  instructor?: InnovatorProfile | null; // Using InnovatorProfile for instructor
  video_url: string;
  price?: number | null;
  duration_minutes?: number | null;
  is_published: boolean;
  link: string; // Derived link for navigation
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

// Dummy Innovators Spotlight data
export const dummyInnovators: InnovatorSpotlight[] = [
  {
    id: "innovator-1",
    profile_id: "creator-1", // Matches a dummy creator ID
    tagline: "Award-winning filmmaker and storyteller.",
    profiles: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://via.placeholder.com/150/C1272D/FFFFFF?text=AK",
      bio: "Aisha is known for her compelling documentaries on African heritage.",
    },
    spotlight_content_id: "article-1", // Matches a dummy article ID
    content: {
      id: "article-1",
      title: "Article Title 1",
      description: "This is a dummy description for article item number 1. It provides a brief overview of the content to fill the space.",
      image_url: "https://via.placeholder.com/400x250/1a202c/FFFFFF?text=Article+1",
      category: "News",
      link_slug: "article-slug-1",
      type: "article",
      link: "/news/article-slug-1",
    },
  },
  {
    id: "innovator-2",
    profile_id: "creator-2",
    tagline: "Tech visionary building solutions for Africa.",
    profiles: {
      id: "creator-2",
      full_name: "Kwame Nkrumah",
      avatar_url: "https://via.placeholder.com/150/1F1F1F/FFFFFF?text=KN",
      bio: "Kwame is a software engineer and entrepreneur focused on sustainable tech.",
    },
    spotlight_content_id: "video-2",
    content: {
      id: "video-2",
      title: "Video Title 2",
      description: "This is a dummy description for video item number 2. It provides a brief overview of the content to fill the space.",
      image_url: "https://via.placeholder.com/400x250/1a202c/FFFFFF?text=Video+2",
      category: "Tech",
      link_slug: "video-slug-2",
      type: "video",
      link: "/watch/video-slug-2",
    },
  },
  {
    id: "innovator-3",
    profile_id: "creator-3",
    tagline: "Fashion designer blending tradition with modern aesthetics.",
    profiles: {
      id: "creator-3",
      full_name: "Zola Mkhize",
      avatar_url: "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=ZM",
      bio: "Zola's designs are inspired by vibrant African textiles and contemporary trends.",
    },
    spotlight_content_id: "show-3",
    content: {
      id: "show-3",
      title: "Show Title 3",
      description: "This is a dummy description for show item number 3. It provides a brief overview of the content to fill the space.",
      image_url: "https://via.placeholder.com/400x250/1a202c/FFFFFF?text=Show+3",
      category: "Fashion",
      link_slug: "show-slug-3",
      type: "show",
      link: "/shows/show-slug-3",
    },
  },
];

// Dummy Masterclasses
export const dummyMasterclasses: Masterclass[] = [
  {
    id: "masterclass-1",
    created_at: new Date().toISOString(),
    title: "The Art of African Storytelling",
    description: "Learn the ancient techniques and modern applications of African oral traditions in narrative creation.",
    image_url: "https://via.placeholder.com/600x400/C1272D/FFFFFF?text=Storytelling",
    category: "Culture",
    link_slug: "african-storytelling",
    instructor_id: "creator-1", // Aisha Khan
    instructor: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://via.placeholder.com/150/C1272D/FFFFFF?text=AK",
      bio: "Award-winning filmmaker and storyteller.",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 49.99,
    duration_minutes: 120,
    is_published: true,
    link: "/masterclasses/african-storytelling",
  },
  {
    id: "masterclass-2",
    created_at: new Date().toISOString(),
    title: "Building Sustainable Tech in Africa",
    description: "A deep dive into developing technology solutions that address unique African challenges and opportunities.",
    image_url: "https://via.placeholder.com/600x400/1F1F1F/FFFFFF?text=Sustainable+Tech",
    category: "Tech",
    link_slug: "sustainable-tech-africa",
    instructor_id: "creator-2", // Kwame Nkrumah
    instructor: {
      id: "creator-2",
      full_name: "Kwame Nkrumah",
      avatar_url: "https://via.placeholder.com/150/1F1F1F/FFFFFF?text=KN",
      bio: "Tech visionary building solutions for Africa.",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 79.99,
    duration_minutes: 180,
    is_published: true,
    link: "/masterclasses/sustainable-tech-africa",
  },
  {
    id: "masterclass-3",
    created_at: new Date().toISOString(),
    title: "Contemporary African Fashion Design",
    description: "Explore the fusion of traditional African textiles and modern design principles to create unique fashion.",
    image_url: "https://via.placeholder.com/600x400/9CA3AF/FFFFFF?text=Fashion+Design",
    category: "Fashion",
    link_slug: "african-fashion-design",
    instructor_id: "creator-3", // Zola Mkhize
    instructor: {
      id: "creator-3",
      full_name: "Zola Mkhize",
      avatar_url: "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=ZM",
      bio: "Fashion designer blending tradition with modern aesthetics.",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 59.99,
    duration_minutes: 150,
    is_published: true,
    link: "/masterclasses/african-fashion-design",
  },
  {
    id: "masterclass-4",
    created_at: new Date().toISOString(),
    title: "Introduction to Afrobeat Production",
    description: "Master the rhythms and melodies of Afrobeat music production from a seasoned producer.",
    image_url: "https://via.placeholder.com/600x400/000000/FFFFFF?text=Afrobeat+Production",
    category: "Music",
    link_slug: "afrobeat-production",
    instructor_id: "creator-1", // Reusing Aisha Khan as an example instructor
    instructor: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://via.placeholder.com/150/C1272D/FFFFFF?text=AK",
      bio: "Award-winning filmmaker and storyteller.",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 69.99,
    duration_minutes: 160,
    is_published: true,
    link: "/masterclasses/afrobeat-production",
  },
];