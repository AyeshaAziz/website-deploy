export type EnquiryStatus = 'TODO' | 'PROCESSED';

export interface AdminEnquiryRow {
  id: number;
  name: string;
  email: string;
  department: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
}
