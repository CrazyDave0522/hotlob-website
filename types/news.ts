export interface NewsArticle {
  id: string;
  title: string;
  cover_image_url: string;
  content: EditorJSContent;
  publish_date: string;
  is_published: boolean;
  excerpt?: string;
  author?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NewsListItem {
  id: string;
  title: string;
  cover_image_url: string;
  excerpt?: string;
  author?: string;
  publish_date: string;
  slug: string;
}

export interface EditorJSContent {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export interface EditorJSBlock {
  id: string;
  type: EditorJSBlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export type EditorJSBlockType =
  | 'paragraph'
  | 'header'
  | 'list'
  | 'image'
  | 'quote'
  | 'code'
  | 'delimiter'
  | 'warning'
  | 'table'
  | 'embed'
  | 'linkTool';

export interface EditorJSParagraphBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
}

export interface EditorJSHeaderBlock {
  type: 'header';
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface EditorJSImageBlock {
  type: 'image';
  data: {
    file: {
      url: string;
      alt?: string;
      caption?: string;
    };
    caption?: string;
    withBorder: boolean;
    withBackground: boolean;
    stretched: boolean;
  };
}

export interface EditorJSListBlock {
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}

export interface NewsAPIResponse {
  data: NewsArticle[];
  error?: string;
}

export interface SingleNewsAPIResponse {
  data: NewsArticle | null;
  error?: string;
}

export type NewsStatus = 'published' | 'draft' | 'archived';

export interface NewsFilters {
  is_published?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'publish_date' | 'created_at';
  orderDirection?: 'asc' | 'desc';
}