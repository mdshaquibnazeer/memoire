// Shared types between client and server

export type ThemeName = 'ROMANTIC_GLOW' | 'CINEMATIC_MEMORIES' | 'SCRAPBOOK_LOVE';
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  theme: ThemeName;
  status: ProjectStatus;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl: string | null;
  heroConfig: HeroConfig | null;
  endingConfig: EndingConfig | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isPasswordProtected: boolean;
  publishedAt: string | null;
  scheduledFor: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  memories?: Memory[];
  galleryItems?: GalleryItem[];
}

export interface HeroConfig {
  message?: string;
  showDate?: boolean;
  showNames?: boolean;
}

export interface EndingConfig {
  title?: string;
  message?: string;
  emoji?: string;
}

export interface Memory {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  videoUrl: string | null;
  location: string | null;
  emoji: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  projectId: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface MediaUpload {
  id: string;
  userId: string;
  projectId: string | null;
  cloudinaryId: string;
  url: string;
  secureUrl: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
  format: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
