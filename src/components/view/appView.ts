import News from './news/news';
import Sources from './sources/sources';
import { ArticlesResponse, SourcesResponse } from '../../types';

export class AppView {
    private readonly news: News = new News();
    private readonly sources: Sources = new Sources();

    public drawNews(data: Partial<ArticlesResponse>): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: Partial<SourcesResponse>): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }

    public collapseSources(): void {
        this.sources.collapse();
    }

    public filterSources(query: string): void {
        this.sources.filter(query);
    }
}

export default AppView;
