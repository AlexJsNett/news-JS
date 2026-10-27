import AppLoader from './appLoader';
import { ArticlesResponse, Callback, Endpoint, SourcesResponse } from '../../types';

class AppController extends AppLoader {
    public getSources(callback: Callback<SourcesResponse>): void {
        super.getResp<SourcesResponse>(
            {
                endpoint: Endpoint.Sources,
            },
            callback
        );
    }

    public getNews(e: Event, callback: Callback<ArticlesResponse>): void {
        let target = e.target;
        const newsContainer = e.currentTarget;

        if (!(newsContainer instanceof HTMLElement)) return;

        while (target instanceof HTMLElement && target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    newsContainer
                        .querySelectorAll('.source__item[aria-pressed="true"]')
                        .forEach((item) => item.setAttribute('aria-pressed', 'false'));
                    target.setAttribute('aria-pressed', 'true');
                    super.getResp<ArticlesResponse>(
                        {
                            endpoint: Endpoint.Everything,
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode;
        }
    }
}

export default AppController;
