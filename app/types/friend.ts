interface Link {
    icon: string
    name: string
    title?: string
    desc?: string
    link: string
    comment?: string
}

interface LinkGroup {
    name: string
    desc?: string
    items: Link[]
}

export type { LinkGroup, Link }
