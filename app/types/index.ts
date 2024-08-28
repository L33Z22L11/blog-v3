declare module 'vue-router' {
    interface RouteMeta {
        hideAside?: boolean
        aside: string[]
    }
}

export type OrderType =
    | 'date'
    | 'updated'
