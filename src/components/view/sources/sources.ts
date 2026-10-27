import './sources.css';
import { NewsSource } from '../../../types';
import { getElement } from '../../../utils/dom';

class Sources {
    private items: HTMLElement[] = [];

    private query = '';

    private isExpanded = false;

    constructor() {
        getElement(document, '.sources-toggle').addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            this.updateLayout();
        });
        window.addEventListener('resize', () => this.updateLayout());
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

    public collapse(): void {
        this.isExpanded = false;
        this.updateLayout();
    }

    public filter(query: string): void {
        this.query = query.trim();
        const normalized = this.query.toLowerCase();
        let visible = 0;

        this.items.forEach((item) => {
            const isMatch = (item.textContent ?? '').toLowerCase().includes(normalized);

            item.hidden = !isMatch;
            if (isMatch) visible += 1;
        });

        getElement(document, '.sources-search__status').textContent = this.getStatusText(visible, this.query);
        this.updateLayout();
    }

    private updateLayout(): void {
        const container = getElement(document, '.sources');
        const toggle = getElement<HTMLButtonElement>(document, '.sources-toggle');
        const isSearching = this.query !== '';
        const isCollapsed = !this.isExpanded && !isSearching;

        container.dataset.collapsed = String(isCollapsed);

        if (isSearching) {
            toggle.hidden = true;
            return;
        }

        toggle.hidden = isCollapsed && container.scrollHeight <= container.clientHeight + 1;
        toggle.textContent = this.isExpanded ? 'Show fewer' : `Show all ${this.items.length} sources`;
        toggle.setAttribute('aria-expanded', String(this.isExpanded));
    }

    private getStatusText(visible: number, query: string): string {
        if (this.items.length === 0) return '';
        if (visible === 0) return `No sources match "${query}"`;
        if (query) return `${visible} of ${this.items.length} sources`;

        return `${this.items.length} sources`;
    }
}

export default Sources;
