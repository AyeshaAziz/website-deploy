'use client';

import { createContext, useContext } from 'react';

export interface UploadResult {
  id: string;
  url: string;
}

export interface UploadAdapter {
  upload(file: File): Promise<UploadResult>;
}

export const UploadAdapterContext = createContext<UploadAdapter | null>(null);

export function useUploadAdapter(): UploadAdapter {
  const adapter = useContext(UploadAdapterContext);
  if (!adapter) {
    throw new Error('No upload adapter is available in this form.');
  }
  return adapter;
}
