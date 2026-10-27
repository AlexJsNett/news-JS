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

        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
