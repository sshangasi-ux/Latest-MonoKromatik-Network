import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for nested content

// Function to add a like to content
export const addLike = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('content_likes')
    .insert([{ user_id: userId, content_id: contentId }])
    .select();

  if (error) {
    // Handle unique constraint error gracefully (user already liked)
    if (error.code === '23505') { // Unique violation error code
      console.warn(`User ${userId} already liked content ${contentId}.`);
      return null; // Indicate no new like was added
    }
    console.error('Error adding like:', error);
    throw error;
  }
  return data;
};

// Function to remove a like from content
export const removeLike = async (userId: string, contentId: string) => {
  const { error } = await supabase
    .from('content_likes')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);

  if (error) {
    console.error('Error removing like:', error);
    throw error;
  }
  return true;
};

// Function to get the like count for a content item
export const getLikeCount = async (contentId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('content_likes')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', contentId);

  if (error) {
    console.error('Error fetching like count:', error);
    throw error;
  }
  return count || 0;
};

// Function to check if a user has liked a content item
export const hasUserLiked = async (userId: string, contentId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('content_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error checking user like status:', error);
    throw error;
  }
  return !!data;
};

// New function to fetch all content items liked by a specific user
export const fetchUserLikedContent = async (userId: string): Promise<ContentItem[]> => {
  const { data, error } = await supabase
    .from('content_likes')
    .select(`
      content_id,
      content:content_id (
        id, title, description, image_url, category, link_slug, type, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name), region, requires_membership
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user liked content:', error);
    throw error;
  }

  const mappedData = (data || [])
    .map((item: any) => {
      const actualContent = item.content?.[0] || null; // Assuming content is an array as per previous observations

      if (!actualContent) return null;

      const content: ContentItem = {
        id: actualContent.id,
        title: actualContent.title,
        description: actualContent.description,
        image_url: actualContent.image_url,
        category: actualContent.category,
        link_slug: actualContent.link_slug,
        type: actualContent.type,
        video_url: actualContent.video_url,
        image_gallery_urls: actualContent.image_gallery_urls,
        music_embed_url: actualContent.music_embed_url,
        creator_id: actualContent.creator_id,
        creator_name: actualContent.profiles?.[0]?.full_name || null,
        region: actualContent.region,
        requires_membership: actualContent.requires_membership,
        link: '', // Will be set below
      };

      let linkPrefix = '';
      switch (content.type) {
        case 'show': linkPrefix = '/shows'; break;
        case 'video': linkPrefix = '/watch'; break;
        case 'article': linkPrefix = '/news'; break;
        case 'event': linkPrefix = '/events'; break;
        case 'sponsored': linkPrefix = '/sponsored'; break;
        case 'music_show': linkPrefix = '/music/shows'; break;
        default: linkPrefix = '';
      }
      content.link = `${linkPrefix}/${content.link_slug}`;

      return content;
    })
    .filter(Boolean) as ContentItem[];

  return mappedData;
};