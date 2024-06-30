import { ReactNode } from "react";

// Define your interfaces
export interface Comment {
  slug?: string;
  content: string;
  date?: string;
  num: number | string;
  answerId: number;
  userId?: string;
  name?: string;
  photo?: string;
}

export interface Video {
  url: string;
  id: string;
  video: string[];
  title?: string;
  description?: string;
  slug?: string;
  content?: string;
  date?: string;
  likes?: string[];
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
  userId?: string;
}

export interface Article {
  slug: string;
  comments: Comment[];
  article: string;
  likes: string[];
  title: string;
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
  image: string;
}

export interface ArticleData {
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
  id: string;
  slug?: string;
  title: string;
}

export interface Topic {
  id: string;
  slug: string;
  questions: { question: string; title?: string; slug?: string }[];
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
  role: any;
  favourite?: any;
  desc?: string;
  video?: string[];
  articles?: string[];
  userId: any;
  answeredQuestions?: { question: string; title?: string; slug?: string }[];
  savedQuestions?: { question: string }[];
  savedPsy?: { question: string }[];
  aboutUser?: any;
  contactUser?: any;
  slogan?: string;
  expert: string;
  comments: Comment[];
  telegramUserID?: any;
}

type Answer = {
  num: number;
  userId: string;
  title: string;
  likes: string[];
  psyPhoto?: string;
  name?: string;
  photo?: string;
  userData?: string;
  slug: string;
  content?: any;
};

export interface Answers {
  photo: string;
  userData: any;
  slug: string;
  content: string;
  num: number;
  title: string;
  likes: string[];
  psyPhoto: any;
  name: any;
  userId: string;
}

export interface Question {
  slug: string;
  comments: Comment[];
  answers: Answers[];
  video: any;
  title: string;
  topics: [];
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface QuestionData {
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
  id: string;
  slug?: string;
  title: string;
  answers: Answer[];
  comments: Comment[];
}

export interface Comments {
  id: string;
  content: string;
  photo: string;
  userId: string;
  name: string;
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
  url?: string[];
  article?: string;
  avtor?: string;
  savedVideos?: string[];
}
