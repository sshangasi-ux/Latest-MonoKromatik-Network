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
  region?: string; // New field for regional focus
  requires_membership?: boolean; // New field for membership protection
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
  region?: string; // Added region to innovator profile
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
  region?: string; // New field for regional focus
}

const AFRICAN_REGIONS = ["Southern Africa", "West Africa", "East Africa", "North Africa", "Central Africa"];
const AFRICAN_CITIES = ["Johannesburg", "Lagos", "Nairobi", "Cairo", "Accra", "Cape Town", "Dakar", "Addis Ababa"];
const AFRICAN_THEMES = ["Heritage", "Innovation", "Art", "Music", "Tech", "Fashion", "Cuisine", "Wildlife", "History"];

const generateDummyContent = (type: "show" | "video" | "article" | "event" | "sponsored" | "music_show", count: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const linkPrefix = {
    show: '/shows',
    video: '/watch',
    article: '/news',
    event: '/events',
    sponsored: '/sponsored',
    music_show: '/music/shows',
  }[type];

  for (let i = 1; i <= count; i++) {
    const id = `${type}-${i}`;
    const region = AFRICAN_REGIONS[Math.floor(Math.random() * AFRICAN_REGIONS.length)];
    const city = AFRICAN_CITIES[Math.floor(Math.random() * AFRICAN_CITIES.length)];
    const theme = AFRICAN_THEMES[Math.floor(Math.random() * AFRICAN_THEMES.length)];

    const title = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${theme} from ${city} ${i}`;
    const description = `Explore this captivating ${type} from ${city}, ${region}, delving into the rich ${theme} of the continent. This piece offers unique insights and vibrant perspectives.`;
    const imageUrl = `https://source.unsplash.com/800x450/?african,${theme},${city},${type}&sig=${Math.random()}`; // More dynamic images
    const category = ["Music", "Tech", "Fashion", "Sports", "Culture", "Nature", "News", "Entertainment", "Documentary"][Math.floor(Math.random() * 9)];
    const linkSlug = `${type}-slug-${i}`;
    const fullContent = `<h2>Deep Dive into ${title}</h2><p>This detailed content for ${type} item ${i} offers an immersive experience into the heart of African culture. From the bustling markets of ${city} to the serene landscapes of ${region}, every aspect is explored with passion and authenticity. Discover the untold stories and vibrant traditions that shape our continent.</p><p>We bring you closer to the creators and the communities, ensuring a rich and meaningful engagement with every piece of content. Join us on this journey of discovery and celebration.</p>`;
    const creatorId = `creator-${(i % 3) + 1}`;
    const creatorName = `Creator ${(i % 3) + 1}`;
    const requiresMembership = i % 2 === 0; // Mark every other item as requiring membership

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
      region: region,
      requires_membership: requiresMembership,
    };

    if (type === "video") {
      item.video_url = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1`;
    } else if (type === "article" || type === "show" || type === "sponsored" || type === "music_show") {
      item.image_gallery_urls = [
        `https://source.unsplash.com/800x450/?african,${theme},${city},gallery1&sig=${Math.random() + 0.1}`,
        `https://source.unsplash.com/800x450/?african,${theme},${city},gallery2&sig=${Math.random() + 0.2}`,
        `https://source.unsplash.com/800x450/?african,${theme},${city},gallery3&sig=${Math.random() + 0.3}`,
      ];
    }
    if (type === "music_show") {
      item.music_embed_url = `https://open.spotify.com/embed/episode/7mF0222222222222222222?utm_source=generator`;
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
export const dummyMusicShows = generateDummyContent("music_show", 6);

// Dummy Music Playlists - updated descriptions
export const dummyMusicPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    title: "Afrobeat Essentials: Lagos Vibes",
    description: "The pulsating rhythms and infectious melodies of Afrobeat, straight from the heart of Lagos.",
    cover_url: "https://source.unsplash.com/300x300/?afrobeat,lagos,music&sig=1",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmFgLh?utm_source=generator",
    genre: "Afrobeat",
  },
  {
    id: "playlist-2",
    title: "Mzansi House Grooves: Jo'burg Edition",
    description: "Deep and soulful house music, capturing the vibrant nightlife and energy of Johannesburg.",
    cover_url: "https://source.unsplash.com/300x300/?johannesburg,house,music&sig=2",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator",
    genre: "House",
  },
  {
    id: "playlist-3",
    title: "Naija Pop Hits: Chart Toppers",
    description: "Catchy tunes and chart-topping anthems from Nigeria's dynamic pop scene.",
    cover_url: "https://source.unsplash.com/300x300/?nigeria,pop,music&sig=3",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2S9rTfJ6z5A?utm_source=generator",
    genre: "Pop",
  },
  {
    id: "playlist-4",
    title: "African Jazz Legends: Timeless Sounds",
    description: "A soulful journey through the timeless sounds and improvisations of African jazz masters.",
    cover_url: "https://source.unsplash.com/300x300/?african,jazz,music&sig=4",
    embed_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXbIe2gUu2z0S?utm_source=generator",
    genre: "Jazz",
  },
];

// Dummy New Music Releases/Artists - updated descriptions
export const dummyNewReleases: MusicTrack[] = [
  {
    id: "track-1",
    title: "New Dawn",
    artist: "Artist X from Kenya",
    album: "Awakening",
    artwork_url: "https://source.unsplash.com/300x300/?kenya,music,artist&sig=5",
    embed_url: "https://open.spotify.com/embed/track/5mF0222222222222222222?utm_source=generator",
  },
  {
    id: "track-2",
    title: "City Lights",
    artist: "Artist Y from Ghana",
    album: "Urban Rhythms",
    artwork_url: "https://source.unsplash.com/300x300/?ghana,music,city&sig=6",
    embed_url: "https://open.spotify.com/embed/track/7mF0222222222222222222?utm_source=generator",
  },
  {
    id: "track-3",
    title: "Desert Bloom",
    artist: "Artist Z from Morocco",
    album: "Oasis",
    artwork_url: "https://source.unsplash.com/300x300/?morocco,music,desert&sig=7",
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
  ...generateDummyContent("music_show", 5),
];

// Dummy ticker messages
export const dummyTickerMessages = [
  "Breaking News: African Tech Summit Kicks Off in Nairobi!",
  "Live Score: Bafana Bafana vs. Super Eagles - Halftime Update!",
  "New Music Release: Amapiano sensation drops new album from Jo'burg!",
  "Fashion Week Highlights: Latest trends from Accra!",
  "Upcoming Event: Pan-African Cultural Festival in Dakar next month!",
];

// Dummy Innovators Spotlight data - updated with regions and more specific content
export const dummyInnovators: InnovatorSpotlight[] = [
  {
    id: "innovator-1",
    profile_id: "creator-1",
    tagline: "Award-winning filmmaker and storyteller from South Africa.",
    profiles: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://source.unsplash.com/150x150/?african,woman,filmmaker&sig=8",
      bio: "Aisha is known for her compelling documentaries on African heritage, often filmed in the vibrant landscapes of Southern Africa.",
      region: "Southern Africa",
    },
    spotlight_content_id: "article-1",
    content: {
      id: "article-1",
      title: "Article: The Resurgence of African Cinema",
      description: "An insightful look into the booming film industry across the continent, with a focus on emerging talent from Nigeria and South Africa.",
      image_url: "https://source.unsplash.com/400x250/?african,cinema,film&sig=9",
      category: "News",
      link_slug: "article-slug-1",
      type: "article",
      link: "/news/article-slug-1",
      region: "Southern Africa",
      requires_membership: false,
    },
  },
  {
    id: "innovator-2",
    profile_id: "creator-2",
    tagline: "Tech visionary building sustainable solutions for West Africa.",
    profiles: {
      id: "creator-2",
      full_name: "Kwame Nkrumah",
      avatar_url: "https://source.unsplash.com/150x150/?african,man,tech&sig=10",
      bio: "Kwame is a software engineer and entrepreneur focused on sustainable tech solutions, particularly impacting communities in Ghana and Nigeria.",
      region: "West Africa",
    },
    spotlight_content_id: "video-2",
    content: {
      id: "video-2",
      title: "Video: Innovating for Impact in Accra",
      description: "A documentary showcasing how local tech startups in Accra are tackling everyday challenges with groundbreaking innovations.",
      image_url: "https://source.unsplash.com/400x250/?accra,tech,innovation&sig=11",
      category: "Tech",
      link_slug: "video-slug-2",
      type: "video",
      link: "/watch/video-slug-2",
      region: "West Africa",
      requires_membership: true,
    },
  },
  {
    id: "innovator-3",
    profile_id: "creator-3",
    tagline: "Fashion designer blending tradition with modern aesthetics from East Africa.",
    profiles: {
      id: "creator-3",
      full_name: "Zola Mkhize",
      avatar_url: "https://source.unsplash.com/150x150/?african,fashion,designer&sig=12",
      bio: "Zola's designs are inspired by vibrant East African textiles and contemporary trends, creating unique pieces that tell a story.",
      region: "East Africa",
    },
    spotlight_content_id: "show-3",
    content: {
      id: "show-3",
      title: "Show: Threads of Nairobi - A Fashion Journey",
      description: "Follow Zola Mkhize as she explores the bustling fashion scene of Nairobi, from traditional markets to modern design studios.",
      image_url: "https://source.unsplash.com/400x250/?nairobi,fashion,design&sig=13",
      category: "Fashion",
      link_slug: "show-slug-3",
      type: "show",
      link: "/shows/show-slug-3",
      region: "East Africa",
      requires_membership: false,
    },
  },
];

// Dummy Masterclasses - updated with regions and more specific content
export const dummyMasterclasses: Masterclass[] = [
  {
    id: "masterclass-1",
    created_at: new Date().toISOString(),
    title: "The Art of African Storytelling: Southern Narratives",
    description: "Learn ancient techniques and modern applications of Southern African oral traditions in narrative creation, focusing on Xhosa and Zulu folklore.",
    image_url: "https://source.unsplash.com/600x400/?african,storytelling,southafrica&sig=14",
    category: "Culture",
    link_slug: "african-storytelling",
    instructor_id: "creator-1",
    instructor: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://source.unsplash.com/150x150/?african,woman,filmmaker&sig=15",
      bio: "Award-winning filmmaker and storyteller.",
      region: "Southern Africa",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 49.99,
    duration_minutes: 120,
    is_published: true,
    link: "/masterclasses/african-storytelling",
    region: "Southern Africa",
  },
  {
    id: "masterclass-2",
    created_at: new Date().toISOString(),
    title: "Building Sustainable Tech in West Africa",
    description: "A deep dive into developing technology solutions that address unique West African challenges and opportunities, with case studies from Ghana and Nigeria.",
    image_url: "https://source.unsplash.com/600x400/?african,tech,westafrica&sig=16",
    category: "Tech",
    link_slug: "sustainable-tech-africa",
    instructor_id: "creator-2",
    instructor: {
      id: "creator-2",
      full_name: "Kwame Nkrumah",
      avatar_url: "https://source.unsplash.com/150x150/?african,man,tech&sig=17",
      bio: "Tech visionary building solutions for Africa.",
      region: "West Africa",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 79.99,
    duration_minutes: 180,
    is_published: true,
    link: "/masterclasses/sustainable-tech-africa",
    region: "West Africa",
  },
  {
    id: "masterclass-3",
    created_at: new Date().toISOString(),
    title: "Contemporary African Fashion Design: East African Influence",
    description: "Explore the fusion of traditional East African textiles and modern design principles to create unique fashion, inspired by Maasai and Swahili aesthetics.",
    image_url: "https://source.unsplash.com/600x400/?african,fashion,eastafrica&sig=18",
    category: "Fashion",
    link_slug: "african-fashion-design",
    instructor_id: "creator-3",
    instructor: {
      id: "creator-3",
      full_name: "Zola Mkhize",
      avatar_url: "https://source.unsplash.com/150x150/?african,fashion,designer&sig=19",
      bio: "Fashion designer blending tradition with modern aesthetics.",
      region: "East Africa",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 59.99,
    duration_minutes: 150,
    is_published: true,
    link: "/masterclasses/african-fashion-design",
    region: "East Africa",
  },
  {
    id: "masterclass-4",
    created_at: new Date().toISOString(),
    title: "Introduction to Afrobeat Production: Nigerian Soundscapes",
    description: "Master the rhythms and melodies of Afrobeat music production from a seasoned producer, focusing on the iconic Nigerian sound.",
    image_url: "https://source.unsplash.com/600x400/?afrobeat,nigeria,music&sig=20",
    category: "Music",
    link_slug: "afrobeat-production",
    instructor_id: "creator-1",
    instructor: {
      id: "creator-1",
      full_name: "Aisha Khan",
      avatar_url: "https://source.unsplash.com/150x150/?african,woman,filmmaker&sig=21",
      bio: "Award-winning filmmaker and storyteller.",
      region: "West Africa",
    },
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1",
    price: 69.99,
    duration_minutes: 160,
    is_published: true,
    link: "/masterclasses/afrobeat-production",
    region: "West Africa",
  },
];