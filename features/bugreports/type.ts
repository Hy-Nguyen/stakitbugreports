export type BugCategory = 'frontend' | 'backend';
export type BugStatus = 'open' | 'in-progress' | 'resolved';

export interface Bug {
  id?: string;
  author: string;
  title: string;
  url: string;
  description: string;
  images: string[];
  category: BugCategory;
  status: BugStatus;
  createdAt?: Date;
  resolvedAt?: Date;
}
