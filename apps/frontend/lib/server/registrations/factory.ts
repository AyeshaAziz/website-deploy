import { SupabaseRegistrationService } from './supabase';
import type { RegistrationService } from './service';

const globalForRegistrations = globalThis as unknown as {
  itqaRegistrationService?: RegistrationService;
};

export function getRegistrationService(): RegistrationService {
  if (globalForRegistrations.itqaRegistrationService) {
    return globalForRegistrations.itqaRegistrationService;
  }

  const service = new SupabaseRegistrationService();
  globalForRegistrations.itqaRegistrationService = service;
  return service;
}