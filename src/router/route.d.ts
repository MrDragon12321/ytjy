declare namespace VueRoute {
    export type Component = () => Promise<typeof import("*.vue")>
    export interface Route {
        path: string,
        name: string,
        alias?: string,
        component?: string | Component,
        redirect?: string,
        always_show?: number | boolean,
        hidden?: number | boolean,
        meta: {
            title: string,
            auth?: boolean,
            onlyUnAuth?: boolean,
            icon?: string,
            keep_alive?: number | boolean,
            abbreviation?: string,
            roles?: string[],
            actions?: number[],
            r_tabs?: number | boolean
        },
        children?: Route[],
        [propName: string]: any
    }
}