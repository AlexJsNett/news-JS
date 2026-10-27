import './sources.css';
import { NewsSource } from '../../../types';
import { getElement } from '../../../utils/dom';

const SCROLL_EDGE_PX = 4;

class Sources {
    private items: HTMLElement[] = [];

    constructor() {
        window.addEventListener('resize', () => this.updateScrollHint());
        getElement(document, '.sources').addEventListener('scroll', () => this.updateScrollHint(), { passive: true });
    }

    public draw(data: NewsSource[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = getElement<HTMLTemplateElement>(document, '#sourceItemTemp');

        data.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;
            const sourceItem = getElement(sourceClone, '.source__item');

            getElement(sourceClone, '.source__item-name').textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);

            this.items.push(sourceItem);
            fragment.append(sourceClone);
        });

        getElement(document, '.sources').append(fragment);
        this.filter(getElement<HTMLInputElement>(document, '.sources-search__input').value);
    }

    public filter(query: string): void {
        const normalized = query.trim().toLowerCase();
        let visible = 0;

        this.items.forEach((item) => {
            const isMatch = (item.textContent ?? '').toLowerCase().includes(normalized);

            item.hidden = !isMatch;
            if (isMatch) visible += 1;
        });

        getElement(document, '.sources-search__status').textContent = this.getStatusText(visible, query.trim());
        this.updateScrollHint();
    }

    private updateScrollHint(): void {
        const container = getElement(document, '.sources');
        const hasMoreRight = container.scrollLeft + container.clientWidth < container.scrollWidth - SCROLL_EDGE_PX;
        const hasMoreBelow = container.scrollTop + container.clientHeight < container.scrollHeight - SCROLL_EDGE_PX;

        container.dataset.more = String(hasMoreRight || hasMoreBelow);
    }

    private getStatusText(visible: number, query: string): string {
        if (this.items.length === 0) return '';
        if (visible === 0) return `No sources match "${query}"`;
        if (query) return `${visible} of ${this.items.length} sources`;

        return `${this.items.length} sources`;
    }
}

export default Sources;
