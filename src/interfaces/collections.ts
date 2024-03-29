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

export interface Users {
  slug: any;
  mail?: any;
  name?: any;
  photo?: any;
  role: 'user' | 'psy';
  favourite?: any;
  desc?: string;
  video?: string[];
  articles?: string[];
  userId: any
}

export interface Answers {
  slug: string;
  content: string,
  num: number,
  title: string,
  likes: string[],
}

export interface Question {
  slug: string;
  comments: Comment[];
  answers: Answers[];
  video: string[];
  title: string;
  topics: [];
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface Data {
  id: string;
  title?: string;
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
  name?: any;
  photo?: string;
  role?: 'user' | 'psy';
  favourite?: any;
  desc?: string;
  comments?: Comment[];
  answers?: string[];
  userId?: any;
}