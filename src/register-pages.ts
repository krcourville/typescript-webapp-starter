import {MainPage} from './pages/MainPage';

/***
 * Register all page components here
 */
const pages = new Map<string, ng.IComponentOptions>([
    ['mainPage', MainPage]
]);

export interface IRegisterPages {
    register(module: ng.IModule);
}

let r: IRegisterPages = {
    register: function (module: ng.IModule) {
        for (let [name, comp] of pages) {
            module.component(name, comp);
        }
    }
};
export default r;