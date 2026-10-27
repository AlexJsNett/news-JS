import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { getElement } from '../../utils/dom';

class App {
    private readonly controller: AppController = new AppController();
    private readonly view: AppView = new AppView();

    public start(): void {
        getElement(document, '.sources').addEventListener('click', (e) =>
            this.controller.getNews(e, (data) => this.view.drawNews(data))
        );
        const search = getElement<HTMLInputElement>(document, '.sources-search__input');
        search.addEventListener('input', () => this.view.filterSources(search.value));
        search.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;

            search.value = '';
            this.view.filterSources('');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key !== '/' || e.target instanceof HTMLInputElement) return;

            e.preventDefault();
            search.focus();
        });

        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
