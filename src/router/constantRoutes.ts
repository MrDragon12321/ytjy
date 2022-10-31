/**
 * @description: 自定义路由，固定，动态路由由接口返回
 * @param {*}
 */

const constantRoutes = [
    {
        path: "",
        redirect: "/login"
    }, 
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/Login.vue'),
        meta: {
            title: "登录/Login"
        }
    },
]
export default constantRoutes