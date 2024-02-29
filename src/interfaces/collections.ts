export interface Comment {
  slug: string;
  content: string;
  date: string;
}

export interface Video {
  slug: string;
  title: string;
  likes: string[];
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface Article {
  slug: string;
  comments: Comment[];
  likes: string[];
  title: string;
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface Topic {
  slug: string;
  questions: string[];
  articles: string[];
  video: string[];
  title: string;
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface User {
  slug: string;
  mail?: string;
  name?: string;
  photo?: string;
  role: 'user' | 'psy';
  favourite?: any;
  desc?: string;
  video?: string[];
  articles?: string[];
}

export interface Question {
  slug: string;
  comments: Comment[];
  answers: string[];
  video: string[];
  title: string;
  likes: string[];
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface Data {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  content?: string;
  date?: string;
  likes?: string[];
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
  questions?: string[];
  articles?: string[];
  video?: string[];
  mail?: string;
  name?: string;
  photo?: string;
  role?: 'user' | 'psy';
  favourite?: any;
  desc?: string;
  comments?: Comment[];
  answers?: string[];
}

