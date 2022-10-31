import {createRouter,createWebHistory} from 'vue-router';
import  constantRoutes from './constantRoutes'

const routes=[
    ...constantRoutes
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

// 存储初始化路由，以便于用于路由重置
const defaultRoutes = router.getRoutes()
export function resetRouter() {
    const routesName = defaultRoutes.map(route => route.name)
    const routes = router.getRoutes()
    routes.forEach(route => {
        if (route.name && !routesName.includes(route.name)) {
            router.removeRoute(route.name)
        }
    })
}

export default router




