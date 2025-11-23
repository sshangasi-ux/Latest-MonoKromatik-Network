import { supabase } from './supabaseClient';
import { CreatorProfile } from './creators'; // Import CreatorProfile for instructor details

// Interface for a Masterclass
export interface Masterclass {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  instructor_id: string;
  instructor?: CreatorProfile | null; // Nested instructor profile
  video_url: string;
  price?: number | null;
  duration_minutes?: number | null;
  is_published: boolean;
  link: string; // Derived link for navigation
}

// Interface for Masterclass Enrollment
export interface MasterclassEnrollment {
  id: string;
  created_at: string;
  user_id: string;
  masterclass_id: string;
  status: string; // e.g., 'enrolled', 'completed'
  progress_percentage?: number | null;
  masterclass?: Masterclass | null; // Nested masterclass details
}

// Function to fetch all published masterclasses
export const fetchMasterclasses = async (limit?: number, offset?: number, category?: string) => {
  let query = supabase
    .from('masterclasses')
    .select(`
      *,
      instructor:instructor_id (
        id, full_name, avatar_url, bio
      )
    `, { count: 'exact' })
    .eq('is_published', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (limit !== undefined) {
    const start = offset !== undefined ? offset : 0;
    const end = start + limit - 1;
    query = query.range(start, end);
  }

  const { data, error, count } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching masterclasses:', error);
    throw error;
  }

  const mappedData: Masterclass[] = (data || []).map((item: any) => ({
    ...item,
    instructor: item.instructor && Array.isArray(item.instructor) && item.instructor.length > 0 ? item.instructor[0] : null,
    link: `/masterclasses/${item.link_slug}`,
  }));

  return { data: mappedData, count };
};

// Function to fetch a single masterclass by its link_slug
export const fetchMasterclassBySlug = async (slug: string): Promise<Masterclass | null> => {
  const { data, error } = await supabase
    .from('masterclasses')
    .select(`
      *,
      instructor:instructor_id (
        id, full_name, avatar_url, bio
      )
    `)
    .eq('link_slug', slug)
    .eq('is_published', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching masterclass with slug ${slug}:`, error);
    throw error;
  }

  if (!data) return null;

  const mappedData: Masterclass = {
    ...data,
    instructor: (data as any).instructor && Array.isArray((data as any).instructor) && (data as any).instructor.length > 0 ? (data as any).instructor[0] : null,
    link: `/masterclasses/${data.link_slug}`,
  };
  return mappedData;
};

// Function to enroll a user in a masterclass
export const enrollInMasterclass = async (userId: string, masterclassId: string) => {
  const { data, error } = await supabase
    .from('masterclass_enrollments')
    .insert({ user_id: userId, masterclass_id: masterclassId, status: 'enrolled' })
    .select()
    .single();

  if (error) {
    console.error('Error enrolling in masterclass:', error);
    throw error;
  }
  return data;
};

// Function to check if a user is enrolled in a masterclass
export const isUserEnrolled = async (userId: string, masterclassId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('masterclass_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('masterclass_id', masterclassId)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking enrollment status:', error);
    throw error;
  }
  return !!data;
};

// Function to fetch a user's enrollments
export const fetchUserEnrollments = async (userId: string, limit?: number) => {
  let query = supabase
    .from('masterclass_enrollments')
    .select(`
      *,
      masterclass:masterclass_id (
        id, title, description, image_url, category, link_slug, video_url, price, duration_minutes, is_published,
        instructor:instructor_id (
          id, full_name, avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }

  const mappedData: MasterclassEnrollment[] = (data || []).map((item: any) => ({
    ...item,
    masterclass: item.masterclass ? {
      ...item.masterclass,
      instructor: item.masterclass.instructor && Array.isArray(item.masterclass.instructor) && item.masterclass.instructor.length > 0 ? item.masterclass.instructor[0] : null,
      link: `/masterclasses/${item.masterclass.link_slug}`,
    } : null,
  }));

  return mappedData;
};

// Function to update masterclass progress
export const updateMasterclassProgress = async (enrollmentId: string, progressPercentage: number, status?: string) => {
  const updateData: { progress_percentage: number; status?: string } = { progress_percentage: progressPercentage };
  if (status) {
    updateData.status = status;
  }

  const { data, error } = await supabase
    .from('masterclass_enrollments')
    .update(updateData)
    .eq('id', enrollmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating masterclass progress:', error);
    throw error;
  }
  return data;
};