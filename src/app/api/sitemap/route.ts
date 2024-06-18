import { NextResponse } from 'next/server';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

type Topic = {
  slug?: string;
  id: string;
};

export async function GET() {
  try {
    const topics: Topic[] = await fetchDataFromCollection('topics');
    const sitemapUrlsTopics = topics.map((topic) => `
      <url>
        <loc>https://psyconica.vercel.app/topics/${topic.slug || topic.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

    const questions: Topic[] = await fetchDataFromCollection('questions');
    const sitemapUrlsQuestions = questions.map((question) => `
    <url>
      <loc>https://psyconica.vercel.app/questions/${question.slug || question.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

    const articles: Topic[] = await fetchDataFromCollection('articles');
    const sitemapUrlsArticles = articles.map((article) => `
  <url>
    <loc>https://psyconica.vercel.app/articles/${article.slug || article.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('');


    const sitemap = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://psyconica.vercel.app</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        ${sitemapUrlsTopics}
        ${sitemapUrlsQuestions}
        ${sitemapUrlsArticles}
      </urlset>
    `;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return new NextResponse('<urlset></urlset>', {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
