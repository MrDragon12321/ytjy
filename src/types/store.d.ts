export interface RootState {
    [propName: string]: any
}
export type Action<C, T> = (context: C, payload: T) => void
export interface Mutation<S, T> {
    (state: S, payload: T): void
}
export type State<T> = T extends { state: infer S } ? {[K in keyof S]: S[K]} : T
export type ModulesState<T> = {
    [key in keyof T]: State<T[key]>
}