interface Link {
    icon: string
    name: string
    desc?: string
    link: string
}

interface LinkGroup {
    name: string
    desc?: string
    items: Link[]
}

export type { LinkGroup, Link }
