import * as Pages from './pages';

/**
 * Configuration options for ComponentLoader
 * 
 * @export
 * @interface ComponentLoaderOptions
 */
export interface ComponentLoaderOptions {
    rootmodule: ng.IModule,
    prefix: string
}


/**
 * ComponentLoader - Applies conventions to 
 * an Typescript-based application, reducing the need for
 * angular boilerplate.
 * 
 * Conventions
 * 
 *  Pages: 
 *      - Root angular components exported as ng.IComponentOptions
 *      - Must end with string 'Page'
 *      - Will be loaded into rootmodule as ${prefix}${export name} 
 *      
 * 
 * @export
 * @class ComponentLoader
 */
export class ComponentLoader {
    /**
     *
     */
    constructor(private options: ComponentLoaderOptions) {

    }

    /**
     * (description)
     * 
     * @returns {ComponentLoader} (description)
     */
    init(): ComponentLoader {
        this.loadPages();

        return this;
    }

    private loadPages() {        
        const pages = Object.keys(Pages)
            .filter(f => f.endsWith('Page'))
            .map(m => {
                return {
                    name: this.parseName(m),
                    options: Pages[m]
                };
            });
            
        for(const page of pages){
            this.options.rootmodule.component(page.name, page.options);            
            console.debug('Loaded Page: ', page.name);
        }
    }
    
    private parseName(value:string):string{
        return this.options.prefix + value;
    }
}