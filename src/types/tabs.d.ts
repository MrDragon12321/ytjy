export interface TopTab {
    index?: number,
    path: string,
    name: RouteRecordName | null | undefined,
    title: string,
    keepAlive: boolean,
    icon?: string,
    parentPath?: string,
    closable?: boolean
}
export interface TypeAction {
    type: string,
    path: string
}