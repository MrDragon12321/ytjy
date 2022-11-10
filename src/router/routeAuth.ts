/**
 * @description: 配置路由守卫
 */
import store from '@/store'
import router from '@/router'
import NProgress from '@/plugins/NProgress'
import { getCookie } from '@/utils/cookie'
import { RouteRecord } from 'vue-router'

const routeAuth = () => {
    router.beforeEach(async (to, from, next) => {
        if (!NProgress.show) {
            NProgress.start()
            NProgress.show = true
        }
        const hasToken = getCookie('token')
        if (hasToken) {

            if (store.getters['routes/addRoutes'].length) {
                next()
            } else {
                try {

                    const { accessedRoutes, defaultRoute } = await store.dispatch('routes/setAsyncRoutes')
                   

                    accessedRoutes.forEach((route: RouteRecord) => router.addRoute(route))
                    if (to.path === '/login') {
                        return next({ path: defaultRoute.path, replace: true })
                    }

                    next({ ...to, replace: true })
                } catch (error) {

                    await store.dispatch('login/resetAll')
                    next({ path: '/login' })
                }
            }
        } else {
            if (to.path === '/login') next()
            else next('/login')
        }
    })
    router.afterEach((to, from) => {
        NProgress.done()
        NProgress.show = false
    })
}

export default routeAuth