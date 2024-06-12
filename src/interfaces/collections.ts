import { ReactNode } from "react";

export interface Comment {
  slug?: string;
  content: string;
  date?: string;
  num: Number | string,
  answerId: Number
  userId?: string;
  name?: string;
  photo?: string;
}

export interface Video {
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
  likes: string[];
  title: string;
  SEOTitle: string;
  SEODesc: string;
  canonical?: string;
}

export interface Topic {
  map(arg0: (question: any) => import("react").JSX.Element): ReactNode;
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
  role: any;
  favourite?: any;
  desc?: string;
  video?: string[];
  articles?: string[];
  userId: any,
  answeredQuestions?: { question: string }[];
  savedQuestions?: { question: string }[];
  savedPsy?: { question: string }[];
  aboutUser?: any,
  contactUser?: any
  slogan?: string;
  expert: string;
  comments: Comment[];
  telegramUserID?: any;

}

export interface Answers {
  photo: string;
  userData: any;
  slug: string;
  content: string,
  num: number,
  title: string,
  likes: string[],
  psyPhoto: any,
  name: any,
  userId: string
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
  title?: ReactNode;
  answers: Answers[];
  comments?: Comment[];

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
  url: string[];
  avtor?: string;
  savedVideos: string[];
}
<Video[]>([])
