declare module 'vue-router' {
    interface RouteMeta {
        aside?: Array<string> | boolean
    }
}

export type OrderType =
    | 'date'
    | 'updated'
