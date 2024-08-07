declare module 'vue-router' {
    interface RouteMeta {
        headerText?: string
    }
}

export type OrderType =
    | 'date'
    | 'updated'