import { createServerSupabaseClient } from '@/utils/supabase/server';
import type { CourseDTO, CourseSitemapEntry } from '@itqasys/core';
import type { CourseService } from './service';

export class CourseApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CourseApiError';
  }
}

export class SupabaseCourseService implements CourseService {
  private getClient() {
    return createServerSupabaseClient();
  }

  async list(): Promise<CourseDTO[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('courses')
      .select('id, url_path, title, summary, description, image_url')
      .eq('status', 'PUBLISHED')
      .order('sort_order');

    if (error) throw new CourseApiError(error.message);

    return (data ?? []).map((course) => ({
      id: course.id,
      urlPath: course.url_path,
      title: course.title,
      summary: course.summary,
      description: course.description ?? undefined,
      imageUrl: course.image_url ?? undefined,
    }));
  }

  async get(urlPath: string): Promise<CourseDTO | null> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('courses')
      .select('id, url_path, title, summary, description, image_url')
      .eq('url_path', urlPath)
      .eq('status', 'PUBLISHED')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new CourseApiError(error.message);
    }

    return {
      id: data.id,
      urlPath: data.url_path,
      title: data.title,
      summary: data.summary,
      description: data.description ?? undefined,
      imageUrl: data.image_url ?? undefined,
    };
  }

  async sitemap(): Promise<CourseSitemapEntry[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('courses')
      .select('url_path, updated_at')
      .eq('status', 'PUBLISHED')
      .order('sort_order');

    if (error) throw new CourseApiError(error.message);

    return (data ?? []).map((course) => ({
      urlPath: course.url_path,
      updatedAt: course.updated_at,
    }));
  }
}