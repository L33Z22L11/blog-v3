export interface Link {
    icon: string
    name: string
    title?: string
    desc?: string
    link: string
    comment?: string
}

export interface LinkGroup {
    name: string
    desc?: string
    items: Link[]
}
