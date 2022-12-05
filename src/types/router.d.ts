export type Component = () => Promise<typeof import("*.vue")>
export interface Route {
    path: string,
    name?: string,
    component?: string | Component,
    redirect?: string,
    meta: {
        title: string,
        icon?: string,
        hidden?: boolean,
        keepAlive?: number | boolean,
        roles?: string[],
        alwaysShow?:boolean
    },
    children?: Route[],
    [propName: string]: any
}