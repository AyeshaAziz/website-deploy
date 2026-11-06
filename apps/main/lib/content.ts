import type { PageDTO, ResourceDTO } from '@itqasys/core';
import {
  getPage as getPageFromService,
  getResources as getResourcesFromService,
  fallbackPage as fallbackPageFromService,
} from '@/lib/services/content';

export const fallbackPage = fallbackPageFromService;

// No DATABASE_URL (or an unreachable database) = frontend-only mode with static fallbacks.
const hasDb = () => Boolean((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY));

export async function getPage(urlPath: string): Promise<PageDTO | null> {
  if (!hasDb()) return fallbackPage(urlPath);
  return getPageFromService(urlPath);
}

export async function getPageSafe(urlPath: string): Promise<PageDTO> {
  try {
    const page = await getPage(urlPath);
    return page ?? fallbackPage(urlPath);
  } catch (error) {
    console.error('Failed to load page from database:', error);
    return fallbackPage(urlPath);
  }
}

export async function getResources(): Promise<ResourceDTO[]> {
  if (!hasDb()) return [];
  return getResourcesFromService();
}

export async function getResourcesSafe(): Promise<ResourceDTO[]> {
  try {
    return await getResources();
  } catch (error) {
    console.error('Failed to load resources from database:', error);
    return [];
  }
}
