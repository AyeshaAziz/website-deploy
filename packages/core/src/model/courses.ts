export interface CourseDTO {
  id: string;
  urlPath: string;
  title: string;
  summary: string;
  description?: string | null;
  imageUrl?: string | null;
}
