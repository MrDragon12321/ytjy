import { createApp,Directive } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import plugins from './plugins'
import RouteAuth from './router/routeAuth'
import components from './components'
import '@/assets/scss/base.scss'
// 自定义指令
import * as directive from '@/directive';


const app = createApp(App)

plugins.forEach((plugin: any) => {
    if (plugin['options']) {
        app.use(plugin['name'], plugin['options'])
    } else {
        app.use(plugin)
    }
})

Object.keys(directive).forEach(key => {
    app.directive(key, (directive as { [key: string]: Directive })[key]);
  });
  

app.use(store).
    use(router).
    use(components).
    mount('#app');
RouteAuth()


