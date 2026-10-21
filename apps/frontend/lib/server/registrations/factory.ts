import { HttpRegistrationService } from './http';
import { MockRegistrationService } from './mock';
import type { RegistrationService } from './service';

const globalForRegistrations = globalThis as unknown as {
  itqaRegistrationService?: RegistrationService;
};

export function getRegistrationService(): RegistrationService {
  if (globalForRegistrations.itqaRegistrationService) {
    return globalForRegistrations.itqaRegistrationService;
  }

  const mode = process.env.REGISTRATION_API_MODE ?? 'mock';
  const service: RegistrationService =
    mode === 'live'
      ? new HttpRegistrationService(process.env.BACKEND_API_URL ?? '')
      : new MockRegistrationService();

  globalForRegistrations.itqaRegistrationService = service;
  return service;
}
