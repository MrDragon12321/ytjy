import { App, } from 'vue'
import Lists from './func/list'
import Bottoms from './func/bottom'
import searchBars from './func/search.vue'
import Pagination from './common/pagination.vue'
import { Search, Edit, RefreshLeft, Delete, Plus, Upload, Download } from '@element-plus/icons-vue' // 常用icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


export default {
    install(app: App) {
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
        app.component('Lists', Lists)
        app.component('Bottoms', Bottoms)
        app.component('SearchBars', searchBars)
        app.component('Pagination', Pagination)
            // app.component('Download', Download)
        // app.component('Upload', Upload)
        // app.component('Edit', Edit)
        // app.component('Delete', Delete)
        // app.component('Plus', Plus)
        // app.component('Search', Search)
        // app.component('RefreshLeft', RefreshLeft)
    }
}