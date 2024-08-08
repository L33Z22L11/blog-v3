declare module 'vue-router' {
    interface RouteMeta {
        aside?: boolean
    }
}

export type OrderType =
    | 'date'
    | 'updated'
