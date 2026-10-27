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
        const sourcesContainer = e.currentTarget;

        if (!(sourcesContainer instanceof HTMLElement)) return;

        while (target instanceof HTMLElement && target !== sourcesContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (sourceId && sourcesContainer.getAttribute('data-source') !== sourceId) {
                    sourcesContainer.setAttribute('data-source', sourceId);
                    sourcesContainer
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
