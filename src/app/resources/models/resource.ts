export interface Resource {
  type: string;
  url?: string;
  content?: object;
  title: string;
  category?: string;
  id?: string;
  description?: string;
  createdAt?: Date;
}
