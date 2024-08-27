declare module 'vue-router' {
    interface RouteMeta {
        aside?: string[]
    }
}

export type OrderType =
    | 'date'
    | 'updated'
