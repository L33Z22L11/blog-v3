declare module 'vue-router' {
    interface RouteMeta {
        headerText?: string
    }
}

type OrderType =
    'date' |
    'updated'

export type {
    OrderType,
}
