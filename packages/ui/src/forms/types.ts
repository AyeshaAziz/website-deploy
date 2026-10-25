import type { FieldConfig, FieldType } from '@itqasys/core/forms';
import type { ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface FieldRendererProps {
  field: FieldConfig;
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  describedBy?: string;
  disabled?: boolean;
}

export type FieldRenderer = (props: FieldRendererProps) => ReactNode;

export type FieldRendererRegistry = Record<FieldType, FieldRenderer>;
