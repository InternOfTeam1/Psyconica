"use client";

import ArticleDetails from '@/components/ArticleDetail';
import { Article, Video } from '@/interfaces/collections';

type Props = {
    videos: Video[]
    articleClientData: Article
}
const ArticlePageClient: React.FC<Props> = ({ articleClientData, videos }) => {
   

    return (
        <div>
            <ArticleDetails articleData={articleClientData} videos={videos}  />
        </div>
    );
};

export default ArticlePageClient;
