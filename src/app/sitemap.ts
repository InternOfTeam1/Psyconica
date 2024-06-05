import { MetadataRoute } from 'next';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

type Topic = {
  slug?: string;
  id: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const topics: Topic[] = await fetchDataFromCollection('topics');
    const sitemapUrls = topics.map((topic) => ({
      url: `https://psyconica.vercel.app/topics/${topic.slug || topic.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: 'https://psyconica.vercel.app',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      ...sitemapUrls,
    ];
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [
      {
        url: 'https://psyconica.vercel.app',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
