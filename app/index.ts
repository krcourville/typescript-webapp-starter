import {App} from './app.module';
import {ComponentLoader} from './ComponentLoader';

new ComponentLoader({ rootmodule: App, prefix: 'cy' }).init();