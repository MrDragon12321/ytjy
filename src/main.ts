import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import plugins from './plugins'
import RouteAuth from './router/routeAuth'
import components from './components'
import '@/assets/scss/base.scss'

const app = createApp(App)

plugins.forEach((plugin: any) => {
    if (plugin['options']) {
        app.use(plugin['name'], plugin['options'])
    } else {
        app.use(plugin)
    }
})

app.use(router).
    use(store).
    use(components).
    mount('#app');
RouteAuth()


