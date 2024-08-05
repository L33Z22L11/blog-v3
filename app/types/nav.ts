interface NavItem {
    icon: string
    text: string
    url: string
}

interface NavGroup {
    title: string
    items: NavItem[]
}

export type Nav = NavItem[] | NavGroup[]
